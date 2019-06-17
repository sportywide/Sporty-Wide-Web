import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { Expose, Type } from 'class-transformer';

export class UserDto {
	@Expose()
	id: number;

	@Expose()
	firstName: string;

	@Expose()
	lastName: string;

	@Expose()
	email: string;

	@Expose()
	role: UserRole;

	@Expose()
	status: UserStatus;

	@Expose()
	@Type(() => Date)
	createdAt: Date;

	@Expose()
	@Type(() => Date)
	updatedAt: Date;
}
