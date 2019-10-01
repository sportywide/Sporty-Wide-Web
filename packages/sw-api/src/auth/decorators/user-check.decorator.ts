import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { User } from '@schema/user/models/user.entity';
import { compareRole } from '@shared/lib/utils/permissions/role';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';

export const CHECK_METADATA = Symbol('checkFunctions');

export type CheckFunction = (user: User) => boolean;

export const UserCheck = (checkFunction: CheckFunction) => SetMetadata(CHECK_METADATA, checkFunction);

export const RolesExact = (roles: UserRole[] = []) => UserCheck((user: User) => user && roles.includes(user.role));

export const Role = (role: UserRole) => UserCheck((user: User) => user && compareRole(user.role, role) >= 0);

export const PendingSocialUser = () =>
	UserCheck((user: User) => user && user.status === UserStatus.PENDING && !!user.socialProvider);

export const ActiveUser = () => UserCheck((user: User) => user && user.status === UserStatus.ACTIVE);
