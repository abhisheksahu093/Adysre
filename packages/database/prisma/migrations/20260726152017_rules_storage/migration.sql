-- CreateTable
CREATE TABLE "rules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "rule_id" TEXT NOT NULL,
    "key" TEXT,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT[],
    "document" JSONB NOT NULL,
    "logic_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rule_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "rule_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "document" JSONB NOT NULL,
    "logic_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,

    CONSTRAINT "rule_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rules_tenant_id_deleted_at_updated_at_idx" ON "rules"("tenant_id", "deleted_at", "updated_at");

-- CreateIndex
CREATE INDEX "rules_tenant_id_kind_idx" ON "rules"("tenant_id", "kind");

-- CreateIndex
CREATE INDEX "rules_tenant_id_status_idx" ON "rules"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "rules_tenant_id_rule_id_idx" ON "rules"("tenant_id", "rule_id");

-- Uniqueness applies to LIVE rows only.
--
-- A full unique constraint would let a soft-deleted row occupy its own id
-- forever, so saving a rule whose id was once removed would fail against this
-- adapter and succeed against the in-memory one -- exactly the divergence the
-- storage conformance suite exists to prevent. Prisma's schema cannot express a
-- partial index, so these are written by hand and noted in the model.
CREATE UNIQUE INDEX "rules_tenant_rule_id_live"
    ON "rules"("tenant_id", "rule_id") WHERE "deleted_at" IS NULL;

CREATE UNIQUE INDEX "rules_tenant_key_live"
    ON "rules"("tenant_id", "key") WHERE "deleted_at" IS NULL;

-- CreateIndex
CREATE INDEX "rule_versions_tenant_id_rule_id_idx" ON "rule_versions"("tenant_id", "rule_id");

-- CreateIndex
CREATE UNIQUE INDEX "rule_versions_rule_id_version_key" ON "rule_versions"("rule_id", "version");

-- AddForeignKey
ALTER TABLE "rules" ADD CONSTRAINT "rules_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rule_versions" ADD CONSTRAINT "rule_versions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rule_versions" ADD CONSTRAINT "rule_versions_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
