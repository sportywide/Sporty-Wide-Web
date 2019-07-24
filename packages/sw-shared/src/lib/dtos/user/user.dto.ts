import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { Expose, Type } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserDto {
	@ApiModelProperty()
	@Expose()
	id: number;

	@ApiModelProperty()
	@Expose()
	firstName: string;

	@ApiModelProperty()
	@Expose()
	lastName: string;

	@ApiModelProperty()
	@Expose()
	email: string;

	@ApiModelProperty()
	@Expose()
	username: string;

	@ApiModelProperty({ enum: ['admin', 'user'] })
	@Expose()
	role: UserRole;

	@ApiModelProperty({ enum: ['active', 'pending'] })
	@Expose()
	status: UserStatus;

	@Expose()
	@Type(() => Date)
	createdAt: Date;

	@Expose()
	@Type(() => Date)
	updatedAt: Date;
}
