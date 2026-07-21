-- Design Playground project storage. See documents/DESIGN_PLAYGROUND_PRD.md §6.1.
--
-- Additive on purpose: it only creates `design_projects`, so it applies cleanly
-- to a database that already carries the core tenancy tables. If this database
-- has never been migrated, run `pnpm db:migrate` to create the full baseline
-- first — the foreign key below requires `organizations` to exist.

-- CreateTable
CREATE TABLE "design_projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "document" JSONB NOT NULL,
    "schema_version" INTEGER NOT NULL DEFAULT 1,
    "thumbnail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "design_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "design_projects_tenant_id_deleted_at_updated_at_idx" ON "design_projects"("tenant_id", "deleted_at", "updated_at");

-- AddForeignKey
ALTER TABLE "design_projects" ADD CONSTRAINT "design_projects_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
