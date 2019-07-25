import { Expose } from 'class-transformer-imp';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { getHigherRoles, getLowerRoles } from '@shared/lib/utils/permissions/role';

export const Editable = (role: UserRole) =>
	Expose({
		groups: [...getEditableGroups(role), ...getCreatableGroups(role)],
	});

export const Creatable = (role: UserRole) =>
	Expose({
		groups: getCreatableGroups(role),
	});

export function getEditableGroups(role) {
	return getHigherRoles(role).map(higherRole => `${higherRole}Editable`);
}

export function getCreatableGroups(role) {
	return getHigherRoles(role).map(higherRole => `${higherRole}Creatable`);
}

export function getEditableGroupsForUser(user) {
	return getLowerRoles(user.role).map(lowerRole => `${lowerRole}Editable`);
}

export function getCreatableGroupsForUser(user) {
	return getLowerRoles(user.role).map(lowerRole => `${lowerRole}Creatable`);
}
