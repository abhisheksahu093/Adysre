import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';

/**
 * Schema and migration invariants.
 *
 * These tests need no database: they read `schema.prisma` and the migration SQL
 * as text and assert the rules the architecture documents claim are always
 * true. That covers the two failure modes a review misses. A model added
 * without a migration, which passes typecheck and then fails on deploy. And a
 * table added without tenant partitioning, which passes everything and leaks
 * one tenant's data into another's.
 */

const here = dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(join(here, 'schema.prisma'), 'utf8');

const migrationsDir = join(here, 'migrations');
// Directories only: `migration_lock.toml` lives here too, and treating it as a
// migration folder is how this test crashed instead of reporting.
const migrations = readdirSync(migrationsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
  .map((entry) => ({
    name: entry.name,
    sql: readFileSync(join(migrationsDir, entry.name, 'migration.sql'), 'utf8'),
  }));

const allSql = migrations.map((m) => m.sql).join('\n');

/** Every `model X { … }` block, with its body. */
function models(): { name: string; body: string }[] {
  const found: { name: string; body: string }[] = [];
  const pattern = /^model\s+(\w+)\s*\{([\s\S]*?)^\}/gm;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(schema)) !== null) {
    found.push({ name: match[1] ?? '', body: match[2] ?? '' });
  }
  return found;
}

/** The `@@map("…")` table name of a model block. */
function tableOf(body: string): string | null {
  return /@@map\("([^"]+)"\)/.exec(body)?.[1] ?? null;
}

const apiStudioModels = models().filter((m) => m.name.startsWith('Api'));

describe('api studio models', () => {
  it('exist', () => {
    assert.ok(apiStudioModels.length >= 10, `found ${apiStudioModels.length}`);
  });

  it('all map to an api_studio_ table', () => {
    for (const model of apiStudioModels) {
      const table = tableOf(model.body);
      assert.ok(table, `${model.name} has no @@map`);
      assert.ok(table.startsWith('api_studio_'), `${model.name} maps to ${table}`);
    }
  });

  it('all carry tenant_id and its foreign key onto organizations', () => {
    for (const model of apiStudioModels) {
      assert.match(model.body, /tenantId\s+String\s+@map\("tenant_id"\)/, model.name);
      assert.match(
        model.body,
        /organization\s+Organization\s+@relation\(fields: \[tenantId\]/,
        model.name,
      );
    }
  });

  it('are all reachable from Organization, so a tenant purge finds them', () => {
    const organization = models().find((m) => m.name === 'Organization');
    assert.ok(organization);
    for (const model of apiStudioModels) {
      assert.match(organization.body, new RegExp(`\\b${model.name}\\[\\]`), model.name);
    }
  });

  it('index every table by tenant, because no query is unscoped', () => {
    for (const model of apiStudioModels) {
      const indexed =
        /@@index\(\[tenantId/.test(model.body) ||
        /@@unique\(\[tenantId/.test(model.body) ||
        // Child tables are reached through their parent's indexed id.
        /@@unique\(\[(workspaceId|nodeId|historyId)/.test(model.body) ||
        /@@index\(\[(collectionId|nodeId|historyId)/.test(model.body);
      assert.ok(indexed, `${model.name} has no tenant-scoped index`);
    }
  });

  it('carry soft-delete columns, except the two append-only logs', () => {
    const appendOnly = new Set(['ApiHistoryEntry', 'ApiResponse', 'ApiRequestVersion', 'ApiCookie']);
    for (const model of apiStudioModels) {
      if (appendOnly.has(model.name)) continue;
      assert.match(model.body, /deletedAt\s+DateTime\?\s+@map\("deleted_at"\)/, model.name);
    }
  });
});

describe('migration', () => {
  it('creates a table for every model in the schema', () => {
    for (const model of apiStudioModels) {
      const table = tableOf(model.body);
      assert.ok(allSql.includes(`CREATE TABLE "${table}"`), `no CREATE TABLE for ${table}`);
    }
  });

  it('keeps the actor columns as uuid, which is what callers must supply', () => {
    // `created_by`/`updated_by` are uuid, so anything writing a synthetic actor
    // id ("demo-user-<org>") is rejected on INSERT while reads keep working.
    // That asymmetry once looked like "storage is unavailable", so the column
    // type is pinned here and the session documents the requirement.
    for (const column of ['created_by', 'updated_by']) {
      assert.match(allSql, new RegExp(`"${column}" UUID`), column);
      assert.doesNotMatch(allSql, new RegExp(`"${column}" TEXT`), column);
    }
  });

  it('declares every column the models declare', () => {
    // A spot check of the columns that are easy to add to a model and forget in
    // a hand-edited migration: the denormalised and encrypted ones.
    for (const column of ['method', 'url', 'value_cipher', 'body_encoding', 'is_default']) {
      assert.ok(allSql.includes(`"${column}"`), column);
    }
  });

  it('enforces the node kind invariant in the database', () => {
    assert.match(allSql, /api_studio_nodes_kind_check/);
    assert.match(allSql, /"kind" = 'request' AND "request" IS NOT NULL/);
  });

  it('enforces the variable scope-to-owner invariant', () => {
    assert.match(allSql, /api_studio_variables_scope_owner_check/);
    for (const scope of ['global', 'environment', 'collection', 'folder', 'request']) {
      assert.ok(allSql.includes(`'${scope}'`), scope);
    }
  });

  it('makes plaintext impossible on a secret row', () => {
    assert.match(allSql, /api_studio_variables_secret_check/);
    assert.match(allSql, /"secret" = true\s+AND "value" IS NULL AND "initial_value" IS NULL/);
  });

  it('requires a history row to be either a response or a failure', () => {
    assert.match(allSql, /api_studio_history_outcome_check/);
  });

  it('never drops a table or a column', () => {
    // Constraints may be dropped and re-added, which is how the constraint
    // migration stays idempotent; tables and columns may not.
    for (const migration of migrations) {
      assert.doesNotMatch(migration.sql, /\bDROP\s+(TABLE|COLUMN)\b/i, migration.name);
      assert.doesNotMatch(migration.sql, /\bALTER\s+TABLE\s+"\w+"\s+RENAME\b/i, migration.name);
    }
  });

  it('cascades from the workspace, so deleting one leaves nothing behind', () => {
    const cascading = [
      'api_studio_collections',
      'api_studio_nodes',
      'api_studio_environments',
      'api_studio_variables',
      'api_studio_history',
      'api_studio_cookies',
      'api_studio_workspace_members',
    ];
    for (const table of cascading) {
      const pattern = new RegExp(
        `ALTER TABLE "${table}" ADD CONSTRAINT "${table}_workspace_id_fkey"[\\s\\S]*?ON DELETE CASCADE`,
      );
      assert.match(allSql, pattern, table);
    }
  });
});
