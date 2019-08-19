import { UserGender } from '@shared/lib/dtos/user/enum/user-gender.enum';

export interface SocialProfileDto {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	displayName: string;
	gender: UserGender;
}
