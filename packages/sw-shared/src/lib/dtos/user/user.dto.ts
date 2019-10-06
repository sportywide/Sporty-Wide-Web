import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { Expose, Type } from 'class-transformer-imp';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';
import { UserGender } from '@shared/lib/dtos/user/enum/user-gender.enum';
import { Field, Int, ObjectType } from '@shared/lib/utils/api/graphql';
import { UserProfileDto } from '@shared/lib/dtos/user/profile/user-profile.dto';

@ObjectType()
export class UserDto {
	@Field(() => Int)
	@ApiModelProperty()
	@Expose()
	id: number;

	@Field()
	@ApiModelProperty()
	@Expose()
	firstName: string;

	@Field({ nullable: true })
	@ApiModelProperty()
	@Expose()
	lastName: string;

	@Field()
	@ApiModelProperty()
	@Expose()
	email: string;

	@Field()
	@ApiModelProperty()
	@Expose()
	username: string;

	@Field(() => UserRole)
	@ApiModelProperty({ enum: ['admin', 'user'] })
	@Expose()
	role: UserRole;

	@Field(() => UserStatus)
	@ApiModelProperty({ enum: ['active', 'pending'] })
	@Expose()
	status: UserStatus;

	@Field(() => UserGender, { nullable: true })
	@ApiModelProperty({ enum: ['male', 'female'] })
	@Expose()
	gender: UserGender;

	@Field({ nullable: true })
	@Expose()
	dob: string;

	@Field({ nullable: true })
	@Expose()
	phone: string;

	@Field(() => Date)
	@Expose()
	@Type(() => Date)
	createdAt: Date;

	@Field(() => Date)
	@Expose()
	@Type(() => Date)
	updatedAt: Date;

	@Field({ nullable: true })
	@Expose()
	profileUrl: string;

	@Field(type => UserProfileDto, { nullable: true })
	@Type(() => UserProfileDto)
	profile: UserProfileDto;
}
