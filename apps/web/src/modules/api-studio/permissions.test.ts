import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  API_STUDIO_MODULE,
  API_STUDIO_PERMISSIONS,
  API_STUDIO_ROLE_PERMISSIONS,
  hasPermission,
} from './permissions';

/**
 * Permission tests. RBAC is the one place where a silent mistake reads as
 * working software: a typo'd permission string denies quietly, and an over-wide
 * implication grants quietly. Both are asserted here.
 */

describe('permission strings', () => {
  it('are all module:resource:action under this module', () => {
    for (const permission of Object.values(API_STUDIO_PERMISSIONS)) {
      const parts = permission.split(':');
      assert.equal(parts.length, 3, permission);
      assert.equal(parts[0], API_STUDIO_MODULE, permission);
      assert.ok(parts[1] && parts[2], permission);
    }
  });

  it('are unique', () => {
    const all = Object.values(API_STUDIO_PERMISSIONS);
    assert.equal(new Set(all).size, all.length);
  });
});

describe('hasPermission', () => {
  it('denies by default', () => {
    assert.equal(hasPermission([], API_STUDIO_PERMISSIONS.collectionRead), false);
  });

  it('grants an exact match', () => {
    assert.equal(
      hasPermission([API_STUDIO_PERMISSIONS.collectionRead], API_STUDIO_PERMISSIONS.collectionRead),
      true,
    );
  });

  it('lets manage imply every action on the same resource', () => {
    assert.equal(
      hasPermission(
        [API_STUDIO_PERMISSIONS.environmentManage],
        API_STUDIO_PERMISSIONS.environmentRead,
      ),
      true,
    );
  });

  it('does not let manage leak across resources', () => {
    assert.equal(
      hasPermission([API_STUDIO_PERMISSIONS.environmentManage], API_STUDIO_PERMISSIONS.secretRead),
      false,
    );
    assert.equal(
      hasPermission([API_STUDIO_PERMISSIONS.workspaceManage], API_STUDIO_PERMISSIONS.requestExecute),
      false,
    );
  });
});

describe('role sets', () => {
  it('let a viewer read without being able to send or see secrets', () => {
    const viewer = API_STUDIO_ROLE_PERMISSIONS.viewer;
    assert.equal(hasPermission(viewer, API_STUDIO_PERMISSIONS.collectionRead), true);
    assert.equal(hasPermission(viewer, API_STUDIO_PERMISSIONS.requestExecute), false);
    assert.equal(hasPermission(viewer, API_STUDIO_PERMISSIONS.secretRead), false);
    assert.equal(hasPermission(viewer, API_STUDIO_PERMISSIONS.requestUpdate), false);
  });

  it('let a developer send requests but not manage the workspace or secrets', () => {
    const developer = API_STUDIO_ROLE_PERMISSIONS.developer;
    assert.equal(hasPermission(developer, API_STUDIO_PERMISSIONS.requestExecute), true);
    assert.equal(hasPermission(developer, API_STUDIO_PERMISSIONS.secretRead), true);
    assert.equal(hasPermission(developer, API_STUDIO_PERMISSIONS.secretManage), false);
    assert.equal(hasPermission(developer, API_STUDIO_PERMISSIONS.workspaceManage), false);
  });

  it('give admin the complete set', () => {
    for (const permission of Object.values(API_STUDIO_PERMISSIONS)) {
      assert.equal(hasPermission(API_STUDIO_ROLE_PERMISSIONS.admin, permission), true, permission);
    }
  });

  it('keep every role a subset of the declared permissions', () => {
    const declared = new Set<string>(Object.values(API_STUDIO_PERMISSIONS));
    for (const [role, permissions] of Object.entries(API_STUDIO_ROLE_PERMISSIONS)) {
      for (const permission of permissions) {
        assert.ok(declared.has(permission), `${role}: ${permission}`);
      }
    }
  });
});
