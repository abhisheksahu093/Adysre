import type { PrismaClient } from '@prisma/client';

/**
 * Plans, features and their per-tier limits.
 *
 * This file IS the pricing policy. Nothing in the UI or the route handlers
 * knows a number; they ask the database. Changing "5 downloads" to "10" is a
 * one-line edit here and a re-seed, with no migration and no deployment of
 * component code.
 *
 * Idempotent: every write is an upsert keyed on a stable string, so running it
 * repeatedly converges rather than duplicating.
 *
 * See docs/SUBSCRIPTIONS.md for why tiers and plans are separate, and for the
 * difference between a stock ceiling and a flow quota.
 */

type Tier = 'free' | 'premium' | 'enterprise';
type Meter = 'stock' | 'flow';
type Window = 'none' | 'day' | 'week' | 'month' | 'rolling' | 'lifetime';

const HOURS = 3600;
const DAYS = 24 * HOURS;

/**
 * Purchasable products.
 *
 * `key` matches the ids already in `apps/web/src/data/pricing.ts`, so the
 * pricing page and the entitlement system name the same things. Prices are
 * placeholders there and here; the server reads them from this table rather
 * than from anything a client sends.
 */
const PLANS: {
  key: string;
  tier: Tier;
  name: string;
  priceCents: number;
  billingInterval: string | null;
  sortOrder: number;
}[] = [
  { key: 'free', tier: 'free', name: 'Free', priceCents: 0, billingInterval: null, sortOrder: 0 },
  { key: 'annual', tier: 'premium', name: 'Annual', priceCents: 9900, billingInterval: 'year', sortOrder: 1 },
  // Same entitlement as annual, different billing. Exactly the case that would
  // force duplicated limits if they lived on the plan instead of the tier.
  { key: 'lifetime', tier: 'premium', name: 'Lifetime', priceCents: 29900, billingInterval: null, sortOrder: 2 },
  { key: 'team', tier: 'enterprise', name: 'Team', priceCents: 49900, billingInterval: 'year', sortOrder: 3 },
];

/** A limit on a feature, for the free tier. */
interface FreeLimit {
  value: number;
  window: Window;
  /** Length of a `rolling` window, in seconds. */
  seconds?: number;
}

interface FeatureSeed {
  key: string;
  module: string;
  name: string;
  description: string;
  meterKind: Meter;
  /** What one unit is called, so the UI can say "3 downloads left". */
  unit: string;
  /**
   * Free-tier limits. More than one means every one of them must pass, which
   * is how Website Intelligence enforces a daily AND a weekly cap.
   */
  free: FreeLimit[];
  sortOrder: number;
}

/**
 * The catalogue.
 *
 * Premium and Enterprise are unlimited everywhere, so only the free limits are
 * listed; the loop below writes NULL (unlimited) rows for the paid tiers.
 *
 * Phase-1 AI tools are deliberately absent. They run entirely in the browser,
 * cost nothing to serve, and any limit on them would be unenforceable.
 */
const FEATURES: FeatureSeed[] = [
  {
    key: 'api-studio.collections',
    module: 'api-studio',
    name: 'API Studio collections',
    description: 'Saved request collections in a workspace.',
    // A ceiling, not consumption: deleting a collection frees the slot.
    meterKind: 'stock',
    unit: 'collection',
    free: [{ value: 5, window: 'none' }],
    sortOrder: 10,
  },
  {
    key: 'design-playground.projects',
    module: 'design-playground',
    name: 'Design Playground projects',
    description: 'Saved design projects.',
    meterKind: 'stock',
    unit: 'project',
    free: [{ value: 5, window: 'none' }],
    sortOrder: 20,
  },
  {
    key: 'builder.pages',
    module: 'builder',
    name: 'Project pages',
    description: 'Pages in a customised project.',
    meterKind: 'stock',
    unit: 'page',
    free: [{ value: 1, window: 'none' }],
    sortOrder: 30,
  },
  {
    key: 'builder.generate-code',
    module: 'builder',
    name: 'Generate code',
    description: 'Export a customised project as code.',
    meterKind: 'flow',
    unit: 'export',
    // Zero, not absent: the feature exists and is visible, and asking for it
    // prompts an upgrade rather than 404ing.
    free: [{ value: 0, window: 'lifetime' }],
    sortOrder: 40,
  },
  {
    key: 'tools.qr.download',
    module: 'tools',
    name: 'QR code downloads',
    description: 'Downloading a generated QR code.',
    meterKind: 'flow',
    unit: 'download',
    free: [{ value: 5, window: 'lifetime' }],
    sortOrder: 50,
  },
  {
    key: 'tools.barcode.download',
    module: 'tools',
    name: 'Barcode downloads',
    description: 'Downloading a generated barcode.',
    meterKind: 'flow',
    unit: 'download',
    free: [{ value: 5, window: 'lifetime' }],
    sortOrder: 60,
  },
  {
    key: 'tools.invoice.generate',
    module: 'tools',
    name: 'Invoices',
    description: 'Generating an invoice document.',
    meterKind: 'flow',
    unit: 'generation',
    free: [{ value: 5, window: 'lifetime' }],
    sortOrder: 70,
  },
  {
    key: 'tools.salary-slip.generate',
    module: 'tools',
    name: 'Salary slips',
    description: 'Generating a salary slip document.',
    meterKind: 'flow',
    unit: 'generation',
    free: [{ value: 5, window: 'lifetime' }],
    sortOrder: 80,
  },
  {
    key: 'tools.signature.generate',
    module: 'tools',
    name: 'Email signatures',
    description: 'Generating an email signature.',
    meterKind: 'flow',
    unit: 'generation',
    free: [{ value: 5, window: 'lifetime' }],
    sortOrder: 90,
  },
  {
    key: 'tools.resume.generate',
    module: 'tools',
    name: 'Resumes',
    description: 'Generating a resume document.',
    meterKind: 'flow',
    unit: 'generation',
    free: [{ value: 5, window: 'lifetime' }],
    sortOrder: 100,
  },
  {
    key: 'tools.ats.scan',
    module: 'tools',
    name: 'ATS scans',
    description: 'Scoring a resume against a job description.',
    meterKind: 'flow',
    unit: 'scan',
    free: [{ value: 5, window: 'lifetime' }],
    sortOrder: 110,
  },
  {
    key: 'ai-tools.phase2.generate',
    module: 'ai-tools',
    name: 'Advanced image tools',
    description: 'Upscaler, enhancer, face blur and smart crop.',
    meterKind: 'flow',
    unit: 'generation',
    free: [{ value: 2, window: 'lifetime' }],
    sortOrder: 120,
  },
  {
    key: 'website-intel.scan',
    module: 'website-intel',
    name: 'Website scans',
    description: 'Auditing a website.',
    meterKind: 'flow',
    unit: 'scan',
    // TWO limits, both of which must pass. Rolling rather than calendar, so a
    // user cannot spend three at 23:59 and three more a minute later.
    free: [
      { value: 3, window: 'rolling', seconds: 24 * HOURS },
      { value: 5, window: 'rolling', seconds: 7 * DAYS },
    ],
    sortOrder: 130,
  },
];

/** Tiers that get unlimited everything. */
const UNLIMITED_TIERS: Tier[] = ['premium', 'enterprise'];

export async function seedEntitlements(prisma: PrismaClient): Promise<void> {
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { key: plan.key },
      update: {
        tier: plan.tier,
        name: plan.name,
        priceCents: plan.priceCents,
        billingInterval: plan.billingInterval,
        sortOrder: plan.sortOrder,
        isActive: true,
      },
      create: {
        key: plan.key,
        tier: plan.tier,
        name: plan.name,
        priceCents: plan.priceCents,
        billingInterval: plan.billingInterval,
        sortOrder: plan.sortOrder,
      },
    });
  }

  for (const feature of FEATURES) {
    const row = await prisma.feature.upsert({
      where: { key: feature.key },
      update: {
        module: feature.module,
        name: feature.name,
        description: feature.description,
        meterKind: feature.meterKind,
        unit: feature.unit,
        sortOrder: feature.sortOrder,
        isActive: true,
      },
      create: {
        key: feature.key,
        module: feature.module,
        name: feature.name,
        description: feature.description,
        meterKind: feature.meterKind,
        unit: feature.unit,
        sortOrder: feature.sortOrder,
      },
    });

    // Re-seeding must converge, and a limit that was removed from this file
    // has to disappear from the database too. Deleting the feature's rows
    // first is what makes "change 5 to 10" work rather than leaving both.
    await prisma.tierFeature.deleteMany({ where: { featureId: row.id } });

    for (const limit of feature.free) {
      await prisma.tierFeature.create({
        data: {
          tier: 'free',
          featureId: row.id,
          limitValue: limit.value,
          windowKind: limit.window,
          // The database CHECK requires a length for rolling and none for
          // anything else, so a mistake here fails at seed time rather than
          // silently counting over an infinite window.
          windowSeconds: limit.window === 'rolling' ? (limit.seconds ?? null) : null,
        },
      });
    }

    for (const tier of UNLIMITED_TIERS) {
      await prisma.tierFeature.create({
        data: {
          tier,
          featureId: row.id,
          // NULL is unlimited. A large number would eventually be reached, and
          // would render in the UI as a real quota.
          limitValue: null,
          // Stock features keep `none`; flow features are unlimited over their
          // whole life, which is what `lifetime` with a null limit means.
          windowKind: feature.meterKind === 'stock' ? 'none' : 'lifetime',
          windowSeconds: null,
        },
      });
    }
  }

  // Every workspace needs a subscription, including ones that existed before
  // this shipped. Without a row the resolver has nothing to read, and while it
  // defaults to free rather than erroring, an explicit row is what makes the
  // profile page able to show a status and a plan name.
  const freePlan = await prisma.plan.findUniqueOrThrow({ where: { key: 'free' } });
  const organizations = await prisma.organization.findMany({
    where: { deletedAt: null },
    select: { id: true },
  });

  for (const org of organizations) {
    await prisma.subscription.upsert({
      where: { tenantId: org.id },
      // Deliberately empty: re-seeding must never downgrade a workspace that
      // has since paid. Only absence is filled in.
      update: {},
      create: {
        tenantId: org.id,
        planId: freePlan.id,
        tier: 'free',
        status: 'active',
      },
    });
  }

  const limits = await prisma.tierFeature.count();
  console.log(
    `Entitlements: ${PLANS.length} plans, ${FEATURES.length} features, ${limits} tier limits, ` +
      `${organizations.length} workspaces subscribed.`,
  );
}
