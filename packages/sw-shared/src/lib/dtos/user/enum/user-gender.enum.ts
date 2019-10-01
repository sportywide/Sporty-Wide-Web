import { registerEnumType } from '@shared/lib/utils/api/graphql';

export enum UserGender {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
	OTHER = 'OTHER',
}

registerEnumType(UserGender, {
	name: 'UserGender',
});
