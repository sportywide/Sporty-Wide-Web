import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';

export interface IUser {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	name: string;
	status: UserStatus;
}
