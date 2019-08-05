import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';

export const userMapping = {
	[UserRole.ADMIN]: 1,
	[UserRole.USER]: 2,
};

export function compareRole(role1, role2) {
	if (userMapping[role1] < userMapping[role2]) {
		return 1;
	}

	if (userMapping[role1] > userMapping[role2]) {
		return -1;
	}

	return 0;
}

export function getLowerRoles(role) {
	return Object.keys(userMapping).filter(currentRole => compareRole(currentRole, role.toUpperCase()) <= 0);
}

export function getHigherRoles(role) {
	return Object.keys(userMapping).filter(currentRole => compareRole(currentRole, role.toUpperCase()) >= 0);
}
