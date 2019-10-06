import { registerEnumType } from '@shared/lib/utils/api/graphql';

export enum UserRole {
	ADMIN = 'ADMIN',
	USER = 'USER',
}

registerEnumType(UserRole, {
	name: 'UserRole',
});
