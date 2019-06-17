import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { IsEmail, IsNotEmpty, Allow } from 'class-validator';
import { Exclude, Type } from 'class-transformer';

export class CreateUserDto {
	@IsNotEmpty()
	firstName: string;

	@IsNotEmpty()
	lastName: string;

	@Allow()
	role: UserRole;

	@Allow()
	status: UserStatus;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@Exclude({ toPlainOnly: true })
	password: string;
}
