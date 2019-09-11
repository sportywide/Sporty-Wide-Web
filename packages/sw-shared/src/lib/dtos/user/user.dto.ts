import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { Expose, Type } from 'class-transformer-imp';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';
import { UserGender } from '@shared/lib/dtos/user/enum/user-gender.enum';

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

	@ApiModelProperty({ enum: ['male', 'female'] })
	@Expose()
	gender: UserGender;

	@Expose()
	dob: string;

	@Expose()
	phone: string;

	@Expose()
	@Type(() => Date)
	createdAt: Date;

	@Expose()
	@Type(() => Date)
	updatedAt: Date;

	@Expose()
	profileUrl: string;
}
