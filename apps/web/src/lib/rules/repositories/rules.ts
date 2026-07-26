import 'server-only';

import { logicHash, parseRule } from '@adysre/rules-core';
import { applyQuery, summarise } from '@adysre/rules-storage';
import type { RuleDocument, RuleQuery, RuleSummary } from '@adysre/rules-types';
import { tenantScope, type Prisma, type PrismaClient } from '@adysre/database';

/**
 * The only place a rule meets Prisma.
 *
 * `documents/BACKEND_ARCHITECTURE.md`: controller to service to repository to
 * database, and only the repository touches Prisma. What sits above this is the
 * `StoragePlugin` adapter, which knows the engine's contract and nothing about
 * a row.
 *
 * THE TENANT IS NEVER A PARAMETER A CALLER CHOOSES. It is bound when the
 * repository is constructed, from a verified session, so there is no shape of
 * request that reads or writes another tenant's rows. Same rule the API Studio
 * repositories follow, and the reason `list` cannot be handed a tenant id.
 */

export interface RuleRepositoryOptions {
  prisma: PrismaClient;
  tenantId: string;
  /** The user id recorded on writes, when there is one. */
  actor?: string | undefined;
}

/** The row's queryable columns, derived from the document on every write. */
function projection(rule: RuleDocument): {
  ruleId: string;
  key: string | null;
  name: string;
  kind: string;
  status: string;
  version: number;
  priority: number;
  enabled: boolean;
  tags: string[];
  document: Prisma.InputJsonValue;
  logicHash: string;
} {
  return {
    ruleId: rule.id,
    key: rule.key ?? null,
    name: rule.name,
    kind: rule.kind,
    status: rule.status,
    version: rule.version,
    priority: rule.priority,
    enabled: rule.enabled,
    tags: [...rule.tags],
    document: rule as unknown as Prisma.InputJsonValue,
    logicHash: logicHash(rule),
  };
}

/**
 * A stored document, back as a rule.
 *
 * Through `parseRule` rather than a cast. A row written by an older build is
 * migrated on the way out, and one written by a NEWER build - a replica mid
 * deploy, a restored backup - is refused rather than half-understood. A cast
 * would hand the executor a shape it has never seen and let it fail somewhere
 * unrelated.
 */
function toDocument(stored: Prisma.JsonValue): RuleDocument | null {
  const parsed = parseRule(stored);
  return parsed.ok ? parsed.rule : null;
}

export class RuleRepository {
  private readonly prisma: PrismaClient;
  private readonly tenantId: string;
  private readonly actor: string | undefined;

  constructor(options: RuleRepositoryOptions) {
    this.prisma = options.prisma;
    this.tenantId = options.tenantId;
    this.actor = options.actor;
  }

  /** Live rows only: a removed rule is invisible to everything above. */
  private get live(): ReturnType<typeof tenantScope> {
    return tenantScope(this.tenantId);
  }

  async findByRuleId(ruleId: string): Promise<RuleDocument | null> {
    const row = await this.prisma.rule.findFirst({
      where: { ...this.live, ruleId },
      select: { document: true },
    });

    return row === null ? null : toDocument(row.document);
  }

  /**
   * List, filtered and paged in SQL.
   *
   * The columns exist so this can happen in the database rather than by loading
   * every rule and sorting it in memory. `applyQuery` in `@adysre/rules-storage`
   * is the SPECIFICATION this translates; the conformance suite is what checks
   * the translation arrived at the same answers.
   *
   * The ordering is the specification's: most recently changed first, ties
   * broken by id, so paging cannot show a rule twice or never.
   */
  async list(query: RuleQuery = {}): Promise<RuleSummary[]> {
    const rows = await this.prisma.rule.findMany({
      where: this.whereFor(query),
      orderBy: [{ updatedAt: 'desc' }, { ruleId: 'asc' }],
      skip: Math.max(0, query.offset ?? 0),
      take: Math.max(0, query.limit ?? 50),
      select: { document: true },
    });

    const documents = rows
      .map((row: { document: Prisma.JsonValue }) => toDocument(row.document))
      .filter((rule: RuleDocument | null): rule is RuleDocument => rule !== null);

    // Summarised through the shared helper, so a row and an in-memory rule
    // produce a byte-identical summary.
    const summaries = documents.map((rule: RuleDocument) => summarise(rule));

    // The search term is the one filter SQL cannot express the same way: the
    // specification searches name, key AND tags as one string. Applying it here
    // over the page would drop matches, so it is part of `whereFor` instead and
    // this only re-sorts what came back.
    return applyQuery(summaries, { limit: summaries.length, offset: 0 });
  }

  async count(query: RuleQuery = {}): Promise<number> {
    return this.prisma.rule.count({ where: this.whereFor(query) });
  }

  private whereFor(query: RuleQuery): Prisma.RuleWhereInput {
    const where: Prisma.RuleWhereInput = { ...this.live };

    if (query.kind !== undefined) where.kind = query.kind;
    if (query.status !== undefined) where.status = query.status;
    // `hasEvery`, not `hasSome`: the specification narrows on every tag given.
    if (query.tags !== undefined && query.tags.length > 0)
      where.tags = { hasEvery: [...query.tags] };

    if (query.search !== undefined && query.search.trim() !== '') {
      const search = query.search.trim();
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { key: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    return where;
  }

  /**
   * Write a document and append its version, or nothing at all.
   *
   * One transaction: a rule whose row moved to version 4 while the versions
   * table stopped at 3 is a history that has silently lost an entry, and
   * nothing downstream could tell.
   */
  async save(rule: RuleDocument): Promise<RuleDocument> {
    const data = projection(rule);

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const existing = await tx.rule.findFirst({
        where: { ...this.live, ruleId: rule.id },
        select: { id: true },
      });

      const row =
        existing === null
          ? await tx.rule.create({
              data: {
                ...data,
                tenantId: this.tenantId,
                ...(this.actor === undefined
                  ? {}
                  : { createdBy: this.actor, updatedBy: this.actor }),
              },
              select: { id: true },
            })
          : await tx.rule.update({
              where: { id: existing.id },
              data: {
                ...data,
                ...(this.actor === undefined ? {} : { updatedBy: this.actor }),
              },
              select: { id: true },
            });

      await tx.ruleVersion.create({
        data: {
          tenantId: this.tenantId,
          ruleId: row.id,
          version: data.version,
          document: data.document,
          logicHash: data.logicHash,
          ...(this.actor === undefined ? {} : { createdBy: this.actor }),
        },
      });
    });

    return rule;
  }

  /**
   * Soft delete, which is what the database convention asks for.
   *
   * The versions stay on disk for audit and become unreachable, because the
   * partial unique index frees the rule's id the moment `deleted_at` is set -
   * so saving that id again is an ordinary new rule, exactly as it is against
   * the in-memory adapter.
   */
  async remove(ruleId: string): Promise<void> {
    await this.prisma.rule.updateMany({
      where: { ...this.live, ruleId },
      data: {
        deletedAt: new Date(),
        ...(this.actor === undefined ? {} : { updatedBy: this.actor }),
      },
    });
  }

  /** Every version of a live rule, newest first. */
  async versions(ruleId: string): Promise<RuleSummary[]> {
    const row = await this.prisma.rule.findFirst({
      where: { ...this.live, ruleId },
      select: { id: true },
    });
    if (row === null) return [];

    const versions = await this.prisma.ruleVersion.findMany({
      where: { tenantId: this.tenantId, ruleId: row.id },
      orderBy: { version: 'desc' },
      select: { document: true },
    });

    return versions
      .map((version: { document: Prisma.JsonValue }) => toDocument(version.document))
      .filter((rule: RuleDocument | null): rule is RuleDocument => rule !== null)
      .map((rule: RuleDocument) => summarise(rule));
  }

  /** One historical version, for a restore. */
  async versionAt(ruleId: string, version: number): Promise<RuleDocument | null> {
    const row = await this.prisma.rule.findFirst({
      where: { ...this.live, ruleId },
      select: { id: true },
    });
    if (row === null) return null;

    const stored = await this.prisma.ruleVersion.findUnique({
      where: { ruleId_version: { ruleId: row.id, version } },
      select: { document: true },
    });

    return stored === null ? null : toDocument(stored.document);
  }
}
