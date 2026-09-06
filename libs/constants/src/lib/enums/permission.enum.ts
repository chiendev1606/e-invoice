/**
 * Permission values are `<module>.<action>` and are persisted in
 * `roles.permissions`. Renaming a key is safe; changing or reusing a value is
 * not — existing role documents still hold the old string.
 */

export enum PermissionModule {
  INVOICE = 'invoice',
  PRODUCT = 'product',
  USER = 'user',
  ROLE = 'role',
}

export enum Permission {
  INVOICE_GET = 'invoice.get',
  INVOICE_LIST = 'invoice.list',
  INVOICE_CREATE = 'invoice.create',
  INVOICE_UPDATE = 'invoice.update',
  INVOICE_DELETE = 'invoice.delete',

  PRODUCT_GET = 'product.get',
  PRODUCT_LIST = 'product.list',
  PRODUCT_CREATE = 'product.create',
  PRODUCT_UPDATE = 'product.update',
  PRODUCT_DELETE = 'product.delete',

  USER_GET = 'user.get',
  USER_LIST = 'user.list',
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',

  ROLE_GET = 'role.get',
  ROLE_LIST = 'role.list',
  ROLE_CREATE = 'role.create',
  ROLE_UPDATE = 'role.update',
  ROLE_DELETE = 'role.delete',
}

export const MODULE_WILDCARD_SUFFIX = '.*';

export const SUPER_ADMIN_PERMISSION = '*';

export const ALL_PERMISSIONS: readonly Permission[] = Object.values(Permission);

export type ModuleWildcard = `${PermissionModule}${typeof MODULE_WILDCARD_SUFFIX}`;

export type GrantablePermission = Permission | typeof SUPER_ADMIN_PERMISSION | ModuleWildcard;

/** Everything accepted in `roles.permissions` — schema validator and seed loader share this. */
export const GRANTABLE_PERMISSIONS: readonly GrantablePermission[] = [
  SUPER_ADMIN_PERMISSION,
  ...Object.values(PermissionModule).map((module): ModuleWildcard => `${module}${MODULE_WILDCARD_SUFFIX}`),
  ...ALL_PERMISSIONS,
];
