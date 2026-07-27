-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('free', 'premium', 'enterprise');

-- CreateEnum
CREATE TYPE "MeterKind" AS ENUM ('stock', 'flow');

-- CreateEnum
CREATE TYPE "UsageWindow" AS ENUM ('none', 'day', 'week', 'month', 'rolling', 'lifetime');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'expired');

-- CreateTable
CREATE TABLE "plans" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "tier" "SubscriptionTier" NOT NULL,
    "name" TEXT NOT NULL,
    "price_cents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billing_interval" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "tier" "SubscriptionTier" NOT NULL DEFAULT 'free',
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "meter_kind" "MeterKind" NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'use',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tier_features" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tier" "SubscriptionTier" NOT NULL,
    "feature_id" UUID NOT NULL,
    "limit_value" INTEGER,
    "window_kind" "UsageWindow" NOT NULL DEFAULT 'none',
    "window_seconds" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tier_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_usage_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "user_id" UUID,
    "feature_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "feature_usage_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plans_key_key" ON "plans"("key");

-- CreateIndex
CREATE INDEX "plans_is_active_idx" ON "plans"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_tenant_id_key" ON "subscriptions"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_external_id_key" ON "subscriptions"("external_id");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_current_period_end_idx" ON "subscriptions"("current_period_end");

-- CreateIndex
CREATE UNIQUE INDEX "features_key_key" ON "features"("key");

-- CreateIndex
CREATE INDEX "features_module_idx" ON "features"("module");

-- CreateIndex
CREATE INDEX "tier_features_tier_idx" ON "tier_features"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "tier_features_tier_feature_id_window_kind_window_seconds_key" ON "tier_features"("tier", "feature_id", "window_kind", "window_seconds");

-- CreateIndex
CREATE INDEX "feature_usage_events_tenant_id_feature_id_occurred_at_idx" ON "feature_usage_events"("tenant_id", "feature_id", "occurred_at");

-- CreateIndex
CREATE INDEX "feature_usage_events_occurred_at_idx" ON "feature_usage_events"("occurred_at");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tier_features" ADD CONSTRAINT "tier_features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_usage_events" ADD CONSTRAINT "feature_usage_events_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_usage_events" ADD CONSTRAINT "feature_usage_events_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Invariants Prisma cannot express, enforced by the database.
-- ---------------------------------------------------------------------------

-- Prisma's @@unique on (tier, feature_id, window_kind, window_seconds) does NOT
-- actually prevent duplicates: window_seconds is NULL for every non-rolling
-- limit, and Postgres treats NULLs as distinct in a unique index, so two
-- identical `lifetime` limits for the same tier and feature would both insert.
-- COALESCE gives NULL a concrete value so the constraint holds.
CREATE UNIQUE INDEX "tier_features_one_limit_per_window"
  ON "tier_features" ("tier", "feature_id", "window_kind", COALESCE("window_seconds", -1));

-- A rolling window is meaningless without a length, and a length is meaningless
-- on any other kind. Left unchecked, a mis-seeded `rolling` row with a NULL
-- length silently counts over an infinite window and never denies anything.
ALTER TABLE "tier_features" ADD CONSTRAINT "tier_features_window_check" CHECK (
  ("window_kind" = 'rolling' AND "window_seconds" IS NOT NULL AND "window_seconds" > 0)
  OR
  ("window_kind" <> 'rolling' AND "window_seconds" IS NULL)
);

-- A negative limit has no meaning. NULL is how "unlimited" is expressed, and 0
-- is how "not on this tier" is expressed, so anything below zero is a mistake
-- that would otherwise deny every request with a confusing message.
ALTER TABLE "tier_features" ADD CONSTRAINT "tier_features_limit_check"
  CHECK ("limit_value" IS NULL OR "limit_value" >= 0);

-- Consuming zero or a negative amount would either be a no-op that still
-- returns success, or would REFUND quota through the consume path.
ALTER TABLE "feature_usage_events" ADD CONSTRAINT "feature_usage_events_quantity_check"
  CHECK ("quantity" > 0);
