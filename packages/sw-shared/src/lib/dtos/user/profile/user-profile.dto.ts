import { a, is, nested, schema } from 'yup-decorator';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';
import { Editable } from '@shared/lib/utils/decorators/permissions';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { AddressDto } from '@shared/lib/dtos/address/address.dto';
import { Expose, Type } from 'class-transformer-imp';
import { Field, Int, ObjectType } from '@shared/lib/utils/api/graphql';

@ObjectType()
@schema()
export class UserProfileDto {
	@Field(() => Int)
	@ApiModelProperty()
	@Expose()
	id: number;

	@Field({ nullable: true })
	@ApiModelProperty()
	@Editable(UserRole.USER)
	@is(a.string().nullable(true))
	work: string;

	@Field({ nullable: true })
	@ApiModelProperty()
	@Editable(UserRole.USER)
	@is(a.string().nullable(true))
	education: string;

	@Field({ nullable: true })
	@ApiModelProperty()
	@Editable(UserRole.USER)
	@is(a.string().nullable(true))
	summary: string;

	@nested()
	@Editable(UserRole.USER)
	@Field(() => AddressDto, { nullable: true })
	@Type(() => AddressDto)
	address: AddressDto;

	@Field({ nullable: true })
	@ApiModelProperty()
	@Expose()
	addressId: number;
}
