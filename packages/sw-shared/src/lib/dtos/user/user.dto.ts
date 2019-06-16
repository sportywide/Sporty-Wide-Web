import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';

export interface UserDto {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	role: UserRole;
	status: UserStatus;
	createdAt?: Date;
	updatedAt?: Date;
}
