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
	id: number;

	@Field()
	@ApiModelProperty()
	firstName: string;

	@Field({ nullable: true })
	@ApiModelProperty()
	lastName: string;

	@Field()
	@ApiModelProperty()
	email: string;

	@Field()
	@ApiModelProperty()
	username: string;

	@Field(() => UserRole)
	@ApiModelProperty({ enum: ['admin', 'user'] })
	role: UserRole;

	@Field(() => UserStatus)
	@ApiModelProperty({ enum: ['active', 'pending'] })
	status: UserStatus;

	@Field(() => UserGender, { nullable: true })
	@ApiModelProperty({ enum: ['male', 'female'] })
	gender: UserGender;

	@Field({ nullable: true })
	dob: string;

	@Field({ nullable: true })
	phone: string;

	@Field(() => Date)
	@Type(() => Date)
	createdAt: Date;

	@Field(() => Date)
	@Type(() => Date)
	updatedAt: Date;

	@Field({ nullable: true })
	profileUrl: string;

	@Field(type => UserProfileDto, { nullable: true })
	@Type(() => UserProfileDto)
	profile: UserProfileDto;
}
