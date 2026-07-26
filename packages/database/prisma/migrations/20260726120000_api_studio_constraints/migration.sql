-- API Studio integrity constraints. See documents/API_STUDIO.md.
--
-- These live in their OWN migration, apart from the tables, for a reason that
-- has already bitten once: Prisma does not model CHECK constraints, so a
-- migration history regenerated from the datamodel (a squash, a fresh `init`)
-- silently loses any that were written into the table migration. Keeping them
-- here means restoring them is re-running one file rather than reconstructing
-- them from a diff.
--
-- Every statement is idempotent: the constraint is dropped if present and then
-- added, so this applies cleanly to a database that has them, one that does
-- not, and one that has a stale version of them.
--
-- `prisma migrate dev` will NOT drop these on the next model change: what it
-- does not model, it does not diff. Only a regenerated baseline does, and this
-- file is the answer to that.

-- Workspace roles. The set matches API_STUDIO_ROLE_PERMISSIONS plus `owner`,
-- which is the member who cannot be removed by another member.
ALTER TABLE "api_studio_workspace_members"
  DROP CONSTRAINT IF EXISTS "api_studio_workspace_members_role_check";
ALTER TABLE "api_studio_workspace_members"
  ADD CONSTRAINT "api_studio_workspace_members_role_check"
  CHECK ("role" IN ('owner', 'admin', 'developer', 'viewer'));

-- A node is a folder or a request, and each carries exactly the columns its
-- kind uses. A request holds its definition (and the method the tree renders
-- from) and never a folder's inherited auth or scripts; a folder holds no
-- definition. Without this, a "folder" could arrive carrying a request and
-- every reader downstream would have to defend against it.
ALTER TABLE "api_studio_nodes" DROP CONSTRAINT IF EXISTS "api_studio_nodes_kind_check";
ALTER TABLE "api_studio_nodes"
  ADD CONSTRAINT "api_studio_nodes_kind_check"
  CHECK (
    ("kind" = 'request' AND "request" IS NOT NULL AND "method" IS NOT NULL
      AND "auth" IS NULL AND "scripts" IS NULL)
    OR
    ("kind" = 'folder' AND "request" IS NULL AND "method" IS NULL AND "url" IS NULL)
  );

ALTER TABLE "api_studio_nodes" DROP CONSTRAINT IF EXISTS "api_studio_nodes_method_check";
ALTER TABLE "api_studio_nodes"
  ADD CONSTRAINT "api_studio_nodes_method_check"
  CHECK ("method" IS NULL OR "method" IN
    ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT'));

ALTER TABLE "api_studio_nodes" DROP CONSTRAINT IF EXISTS "api_studio_nodes_position_check";
ALTER TABLE "api_studio_nodes"
  ADD CONSTRAINT "api_studio_nodes_position_check" CHECK ("position" >= 0);

-- A variable's scope and its owner column must agree. The scope column exists
-- so the resolver can order the stack in one indexed query; this constraint is
-- what stops it from becoming a second, disagreeing source of truth.
ALTER TABLE "api_studio_variables"
  DROP CONSTRAINT IF EXISTS "api_studio_variables_scope_owner_check";
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
  DROP CONSTRAINT IF EXISTS "api_studio_variables_secret_check";
ALTER TABLE "api_studio_variables"
  ADD CONSTRAINT "api_studio_variables_secret_check"
  CHECK (
    ("secret" = true  AND "value" IS NULL AND "initial_value" IS NULL AND "value_cipher" IS NOT NULL)
    OR
    ("secret" = false AND "value_cipher" IS NULL)
  );

-- The `{{name}}` grammar the resolver can address. A key outside it could be
-- stored but never referenced.
ALTER TABLE "api_studio_variables" DROP CONSTRAINT IF EXISTS "api_studio_variables_key_check";
ALTER TABLE "api_studio_variables"
  ADD CONSTRAINT "api_studio_variables_key_check" CHECK ("key" ~ '^[A-Za-z0-9_.-]+$');

ALTER TABLE "api_studio_history" DROP CONSTRAINT IF EXISTS "api_studio_history_status_check";
ALTER TABLE "api_studio_history"
  ADD CONSTRAINT "api_studio_history_status_check"
  CHECK (("status" IS NULL OR ("status" >= 100 AND "status" <= 599)) AND "duration_ms" >= 0);

-- A history row records either a response or a failure, never both and never
-- neither: `status` set means it completed, `error_code` set means it did not.
ALTER TABLE "api_studio_history" DROP CONSTRAINT IF EXISTS "api_studio_history_outcome_check";
ALTER TABLE "api_studio_history"
  ADD CONSTRAINT "api_studio_history_outcome_check"
  CHECK (("status" IS NULL) <> ("error_code" IS NULL));

ALTER TABLE "api_studio_responses" DROP CONSTRAINT IF EXISTS "api_studio_responses_encoding_check";
ALTER TABLE "api_studio_responses"
  ADD CONSTRAINT "api_studio_responses_encoding_check"
  CHECK ("body_encoding" IN ('utf8', 'base64'));

ALTER TABLE "api_studio_responses" DROP CONSTRAINT IF EXISTS "api_studio_responses_status_check";
ALTER TABLE "api_studio_responses"
  ADD CONSTRAINT "api_studio_responses_status_check"
  CHECK ("status" >= 100 AND "status" <= 599 AND "header_bytes" >= 0 AND "body_bytes" >= 0);

ALTER TABLE "api_studio_request_versions"
  DROP CONSTRAINT IF EXISTS "api_studio_request_versions_version_check";
ALTER TABLE "api_studio_request_versions"
  ADD CONSTRAINT "api_studio_request_versions_version_check" CHECK ("version" >= 1);

ALTER TABLE "api_studio_cookies" DROP CONSTRAINT IF EXISTS "api_studio_cookies_same_site_check";
ALTER TABLE "api_studio_cookies"
  ADD CONSTRAINT "api_studio_cookies_same_site_check"
  CHECK ("same_site" IS NULL OR "same_site" IN ('strict', 'lax', 'none'));

-- A cookie's path is a path, and `secure` is implied by SameSite=None, which is
-- the rule browsers enforce; the jar should not hold a cookie no browser would.
ALTER TABLE "api_studio_cookies" DROP CONSTRAINT IF EXISTS "api_studio_cookies_path_check";
ALTER TABLE "api_studio_cookies"
  ADD CONSTRAINT "api_studio_cookies_path_check"
  CHECK ("path" LIKE '/%' AND ("same_site" IS DISTINCT FROM 'none' OR "secure" = true));
