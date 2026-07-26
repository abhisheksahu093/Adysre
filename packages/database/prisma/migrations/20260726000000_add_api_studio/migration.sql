-- API Studio storage. See documents/API_STUDIO.md.
--
-- Additive: it only creates the ten `api_studio_*` tables, so it applies
-- cleanly to a database that already carries the core tenancy tables. If this
-- database has never been migrated, run `pnpm db:migrate` to create the full
-- baseline first: every table below has a foreign key onto `organizations`.
--
-- The CHECK constraints at the end are the part Prisma cannot express. They are
-- not decoration: they are the difference between "the repository is supposed
-- to keep this true" and "the database will not store it otherwise". Prisma
-- does not model check constraints, so it will never diff them away either.

-- CreateTable
CREATE TABLE "api_studio_workspaces" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "api_studio_workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_studio_workspace_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "api_studio_workspace_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_studio_collections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "color" TEXT,
    "icon" TEXT,
    "tags" TEXT[],
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "auth" JSONB NOT NULL,
    "scripts" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "api_studio_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_studio_nodes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "collection_id" UUID NOT NULL,
    "parent_id" UUID,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "tags" TEXT[],
    "color" TEXT,
    "icon" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "method" TEXT,
    "url" TEXT,
    "request" JSONB,
    "auth" JSONB,
    "scripts" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "api_studio_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_studio_environments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "api_studio_environments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_studio_variables" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "scope" TEXT NOT NULL,
    "environment_id" UUID,
    "collection_id" UUID,
    "node_id" UUID,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "value_cipher" TEXT,
    "initial_value" TEXT,
    "secret" BOOLEAN NOT NULL DEFAULT false,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "api_studio_variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_studio_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "node_id" UUID,
    "method" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" INTEGER,
    "error_code" TEXT,
    "duration_ms" INTEGER NOT NULL,
    "request_bytes" INTEGER NOT NULL DEFAULT 0,
    "response_bytes" INTEGER NOT NULL DEFAULT 0,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "request" JSONB NOT NULL,
    "executed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,

    CONSTRAINT "api_studio_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_studio_responses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "history_id" UUID NOT NULL,
    "status" INTEGER NOT NULL,
    "status_text" TEXT NOT NULL,
    "http_version" TEXT,
    "headers" JSONB NOT NULL,
    "cookies" JSONB NOT NULL,
    "body_encoding" TEXT NOT NULL,
    "body" TEXT,
    "truncated" BOOLEAN NOT NULL DEFAULT false,
    "header_bytes" INTEGER NOT NULL DEFAULT 0,
    "body_bytes" INTEGER NOT NULL DEFAULT 0,
    "timings" JSONB NOT NULL,
    "redirects" JSONB NOT NULL,
    "insecure" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_studio_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_studio_request_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "request" JSONB NOT NULL,
    "label" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,

    CONSTRAINT "api_studio_request_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_studio_cookies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "domain" TEXT NOT NULL,
    "path" TEXT NOT NULL DEFAULT '/',
    "name" TEXT NOT NULL,
    "value_cipher" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),
    "secure" BOOLEAN NOT NULL DEFAULT false,
    "http_only" BOOLEAN NOT NULL DEFAULT false,
    "same_site" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "api_studio_cookies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "api_studio_workspaces_tenant_id_deleted_at_updated_at_idx" ON "api_studio_workspaces"("tenant_id", "deleted_at", "updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "api_studio_workspaces_tenant_id_slug_key" ON "api_studio_workspaces"("tenant_id", "slug");

-- CreateIndex
CREATE INDEX "api_studio_workspace_members_tenant_id_user_id_deleted_at_idx" ON "api_studio_workspace_members"("tenant_id", "user_id", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "api_studio_workspace_members_workspace_id_user_id_key" ON "api_studio_workspace_members"("workspace_id", "user_id");

-- CreateIndex
CREATE INDEX "api_studio_collections_tenant_id_workspace_id_deleted_at_up_idx" ON "api_studio_collections"("tenant_id", "workspace_id", "deleted_at", "updated_at");

-- CreateIndex
CREATE INDEX "api_studio_nodes_collection_id_parent_id_position_idx" ON "api_studio_nodes"("collection_id", "parent_id", "position");

-- CreateIndex
CREATE INDEX "api_studio_nodes_tenant_id_workspace_id_deleted_at_updated__idx" ON "api_studio_nodes"("tenant_id", "workspace_id", "deleted_at", "updated_at");

-- CreateIndex
CREATE INDEX "api_studio_nodes_tenant_id_workspace_id_favorite_idx" ON "api_studio_nodes"("tenant_id", "workspace_id", "favorite");

-- CreateIndex
CREATE INDEX "api_studio_environments_tenant_id_workspace_id_deleted_at_idx" ON "api_studio_environments"("tenant_id", "workspace_id", "deleted_at");

-- CreateIndex
CREATE INDEX "api_studio_variables_tenant_id_workspace_id_scope_deleted_a_idx" ON "api_studio_variables"("tenant_id", "workspace_id", "scope", "deleted_at");

-- CreateIndex
CREATE INDEX "api_studio_variables_environment_id_idx" ON "api_studio_variables"("environment_id");

-- CreateIndex
CREATE INDEX "api_studio_variables_collection_id_idx" ON "api_studio_variables"("collection_id");

-- CreateIndex
CREATE INDEX "api_studio_variables_node_id_idx" ON "api_studio_variables"("node_id");

-- CreateIndex
CREATE INDEX "api_studio_history_tenant_id_workspace_id_executed_at_idx" ON "api_studio_history"("tenant_id", "workspace_id", "executed_at");

-- CreateIndex
CREATE INDEX "api_studio_history_tenant_id_workspace_id_favorite_idx" ON "api_studio_history"("tenant_id", "workspace_id", "favorite");

-- CreateIndex
CREATE INDEX "api_studio_history_node_id_idx" ON "api_studio_history"("node_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_studio_responses_history_id_key" ON "api_studio_responses"("history_id");

-- CreateIndex
CREATE INDEX "api_studio_responses_tenant_id_created_at_idx" ON "api_studio_responses"("tenant_id", "created_at");

-- CreateIndex
CREATE INDEX "api_studio_request_versions_tenant_id_node_id_idx" ON "api_studio_request_versions"("tenant_id", "node_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_studio_request_versions_node_id_version_key" ON "api_studio_request_versions"("node_id", "version");

-- CreateIndex
CREATE INDEX "api_studio_cookies_tenant_id_workspace_id_expires_at_idx" ON "api_studio_cookies"("tenant_id", "workspace_id", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "api_studio_cookies_workspace_id_domain_path_name_key" ON "api_studio_cookies"("workspace_id", "domain", "path", "name");

-- AddForeignKey
ALTER TABLE "api_studio_workspaces" ADD CONSTRAINT "api_studio_workspaces_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_workspace_members" ADD CONSTRAINT "api_studio_workspace_members_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_workspace_members" ADD CONSTRAINT "api_studio_workspace_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "api_studio_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_collections" ADD CONSTRAINT "api_studio_collections_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_collections" ADD CONSTRAINT "api_studio_collections_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "api_studio_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_nodes" ADD CONSTRAINT "api_studio_nodes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_nodes" ADD CONSTRAINT "api_studio_nodes_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "api_studio_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_nodes" ADD CONSTRAINT "api_studio_nodes_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "api_studio_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_nodes" ADD CONSTRAINT "api_studio_nodes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "api_studio_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_environments" ADD CONSTRAINT "api_studio_environments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_environments" ADD CONSTRAINT "api_studio_environments_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "api_studio_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_variables" ADD CONSTRAINT "api_studio_variables_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_variables" ADD CONSTRAINT "api_studio_variables_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "api_studio_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_variables" ADD CONSTRAINT "api_studio_variables_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "api_studio_environments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_variables" ADD CONSTRAINT "api_studio_variables_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "api_studio_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_variables" ADD CONSTRAINT "api_studio_variables_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "api_studio_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_history" ADD CONSTRAINT "api_studio_history_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_history" ADD CONSTRAINT "api_studio_history_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "api_studio_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_history" ADD CONSTRAINT "api_studio_history_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "api_studio_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_responses" ADD CONSTRAINT "api_studio_responses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_responses" ADD CONSTRAINT "api_studio_responses_history_id_fkey" FOREIGN KEY ("history_id") REFERENCES "api_studio_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_request_versions" ADD CONSTRAINT "api_studio_request_versions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_request_versions" ADD CONSTRAINT "api_studio_request_versions_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "api_studio_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_cookies" ADD CONSTRAINT "api_studio_cookies_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_studio_cookies" ADD CONSTRAINT "api_studio_cookies_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "api_studio_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- Integrity constraints Prisma cannot model
-- ---------------------------------------------------------------------------

-- Workspace roles. The set matches API_STUDIO_ROLE_PERMISSIONS plus `owner`,
-- which is the member who cannot be removed by another member.
ALTER TABLE "api_studio_workspace_members"
  ADD CONSTRAINT "api_studio_workspace_members_role_check"
  CHECK ("role" IN ('owner', 'admin', 'developer', 'viewer'));

-- A node is a folder or a request, and each carries exactly the columns its
-- kind uses. A request holds its definition (and the method the tree renders
-- from) and never a folder's inherited auth or scripts; a folder holds no
-- definition. Without this, a "folder" could arrive carrying a request and
-- every reader downstream would have to defend against it.
ALTER TABLE "api_studio_nodes"
  ADD CONSTRAINT "api_studio_nodes_kind_check"
  CHECK (
    ("kind" = 'request' AND "request" IS NOT NULL AND "method" IS NOT NULL
      AND "auth" IS NULL AND "scripts" IS NULL)
    OR
    ("kind" = 'folder' AND "request" IS NULL AND "method" IS NULL AND "url" IS NULL)
  );

ALTER TABLE "api_studio_nodes"
  ADD CONSTRAINT "api_studio_nodes_method_check"
  CHECK ("method" IS NULL OR "method" IN
    ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT'));

ALTER TABLE "api_studio_nodes"
  ADD CONSTRAINT "api_studio_nodes_position_check"
  CHECK ("position" >= 0);

-- A variable's scope and its owner column must agree. The scope column exists
-- so the resolver can order the stack in one indexed query; this constraint is
-- what stops it from becoming a second, disagreeing source of truth.
ALTER TABLE "api_studio_variables"
  ADD CONSTRAINT "api_studio_variables_scope_owner_check"
  CHECK (
    ("scope" = 'global'      AND "environment_id" IS NULL     AND "collection_id" IS NULL     AND "node_id" IS NULL)
    OR ("scope" = 'environment' AND "environment_id" IS NOT NULL AND "collection_id" IS NULL     AND "node_id" IS NULL)
    OR ("scope" = 'collection'  AND "collection_id" IS NOT NULL  AND "environment_id" IS NULL    AND "node_id" IS NULL)
    OR ("scope" IN ('folder', 'request') AND "node_id" IS NOT NULL AND "environment_id" IS NULL AND "collection_id" IS NULL)
  );

-- A secret is ciphertext and nothing else. Plaintext and the shared initial
-- value are both forbidden on a secret row, so a bug in the write path cannot
-- quietly persist a token in the clear.
ALTER TABLE "api_studio_variables"
  ADD CONSTRAINT "api_studio_variables_secret_check"
  CHECK (
    ("secret" = true  AND "value" IS NULL AND "initial_value" IS NULL AND "value_cipher" IS NOT NULL)
    OR
    ("secret" = false AND "value_cipher" IS NULL)
  );

-- The `{{name}}` grammar the resolver can address. A key outside it could be
-- stored but never referenced.
ALTER TABLE "api_studio_variables"
  ADD CONSTRAINT "api_studio_variables_key_check"
  CHECK ("key" ~ '^[A-Za-z0-9_.-]+$');

ALTER TABLE "api_studio_history"
  ADD CONSTRAINT "api_studio_history_status_check"
  CHECK (("status" IS NULL OR ("status" >= 100 AND "status" <= 599)) AND "duration_ms" >= 0);

-- A history row records either a response or a failure, never both and never
-- neither: `status` set means it completed, `error_code` set means it did not.
ALTER TABLE "api_studio_history"
  ADD CONSTRAINT "api_studio_history_outcome_check"
  CHECK (("status" IS NULL) <> ("error_code" IS NULL));

ALTER TABLE "api_studio_responses"
  ADD CONSTRAINT "api_studio_responses_encoding_check"
  CHECK ("body_encoding" IN ('utf8', 'base64'));

ALTER TABLE "api_studio_responses"
  ADD CONSTRAINT "api_studio_responses_status_check"
  CHECK ("status" >= 100 AND "status" <= 599 AND "header_bytes" >= 0 AND "body_bytes" >= 0);

ALTER TABLE "api_studio_request_versions"
  ADD CONSTRAINT "api_studio_request_versions_version_check"
  CHECK ("version" >= 1);

ALTER TABLE "api_studio_cookies"
  ADD CONSTRAINT "api_studio_cookies_same_site_check"
  CHECK ("same_site" IS NULL OR "same_site" IN ('strict', 'lax', 'none'));

-- A cookie's path is a path, and `secure` is implied by SameSite=None, which is
-- the rule browsers enforce; the jar should not hold a cookie no browser would.
ALTER TABLE "api_studio_cookies"
  ADD CONSTRAINT "api_studio_cookies_path_check"
  CHECK ("path" LIKE '/%' AND ("same_site" IS DISTINCT FROM 'none' OR "secure" = true));
