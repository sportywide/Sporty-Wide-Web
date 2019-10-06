import { registerEnumType } from '@shared/lib/utils/api/graphql';

export enum UserStatus {
	PENDING = 'PENDING',
	ACTIVE = 'ACTIVE',
}
registerEnumType(UserStatus, {
	name: 'UserStatus',
});
