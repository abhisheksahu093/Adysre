/**
 * ADYSRE API Studio - the module's RBAC vocabulary.
 *
 * The manifest itself lives in `@adysre/types` because the database seed has to
 * insert the same strings and cannot import from the web app. This file is the
 * module's door onto it, so nothing under `modules/api-studio` reaches across
 * packages for a permission, and no route handler ever types one as a literal.
 *
 * Deny by default: a caller holding none of these can read nothing.
 */

export {
  API_STUDIO_MODULE,
  API_STUDIO_PERMISSIONS,
  API_STUDIO_ROLE_PERMISSIONS,
  hasPermission,
  type ApiStudioPermission,
  type ApiStudioRole,
} from '@adysre/types';
