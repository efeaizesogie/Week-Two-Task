import { SetMetadata } from '@nestjs/common';
import type { Role } from '@rfpilot/db';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route to one or more roles. Default (unset) = any authenticated
 * user with membership in the target org.
 *
 * Example: `@Roles('OWNER', 'ADMIN')`
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
