import { RoleName } from '@common/constants/enums/user-access-role.enum';
import { GRANTABLE_PERMISSIONS, GrantablePermission } from '@common/constants/enums/permission.enum';
import rolesSeedFile from './roles.seed.json';

export interface RoleSeed {
  roleName: RoleName;
  description: string;
  permissions: GrantablePermission[];
}

const VALID_PERMISSIONS = new Set<string>(GRANTABLE_PERMISSIONS);
const ROLE_NAMES = new Set<string>(Object.values(RoleName));

/** Fails before the database is touched, so a typo can never land as a grant that matches nothing. */
export function loadRoleSeeds(): RoleSeed[] {
  const seeds = rolesSeedFile.roles as RoleSeed[];
  const seen = new Set<string>();

  for (const seed of seeds) {
    if (!ROLE_NAMES.has(seed.roleName)) {
      throw new Error(`Unknown role "${seed.roleName}" in roles.seed.json — add it to the RoleName enum first`);
    }

    if (seen.has(seed.roleName)) {
      throw new Error(`Duplicate role "${seed.roleName}" in roles.seed.json`);
    }
    seen.add(seed.roleName);

    const unknown = seed.permissions.filter((permission) => !VALID_PERMISSIONS.has(permission));
    if (unknown.length) {
      throw new Error(`Unknown permission(s) for role "${seed.roleName}": ${unknown.join(', ')}`);
    }
  }

  return seeds;
}
