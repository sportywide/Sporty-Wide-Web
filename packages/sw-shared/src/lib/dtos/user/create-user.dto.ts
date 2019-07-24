import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { IsEmail, IsNotEmpty, Allow } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiModelProperty()
	@IsNotEmpty()
	firstName: string;

	@ApiModelProperty()
	@IsNotEmpty()
	lastName: string;

	@ApiModelProperty()
	@IsNotEmpty()
	username: string;

	@Allow()
	role: UserRole;

	@Allow()
	status: UserStatus;

	@ApiModelProperty()
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiModelProperty()
	@IsNotEmpty()
	@Exclude({ toPlainOnly: true })
	password: string;
}
