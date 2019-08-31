import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { SocialProvider } from '@shared/lib/dtos/user/enum/social-provider.enum';

export interface IUser {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	name: string;
	status: UserStatus;
	socialProvider: SocialProvider;
}
