import { a, is, schema } from 'yup-decorator';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';
import { Editable } from '@shared/lib/utils/decorators/permissions';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { Expose } from 'class-transformer-imp';
import { Field, Int, ObjectType } from '@shared/lib/utils/api/graphql';

@ObjectType()
@schema()
export class AddressDto {
	@ApiModelProperty()
	@Field(() => Int)
	@Expose()
	id?: number;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@Field({ nullable: true })
	@is(a.string().nullable(true))
	street1?: string;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@Field({ nullable: true })
	@is(a.string().nullable(true))
	street2?: string;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@Field({ nullable: true })
	@is(a.string().nullable(true))
	state?: string;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@Field({ nullable: true })
	@is(a.string().nullable(true))
	city?: string;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@Field({ nullable: true })
	@is(a.string().nullable(true))
	country?: string;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@Field({ nullable: true })
	@is(a.string().nullable(true))
	suburb?: string;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@Field({ nullable: true })
	@is(a.string().nullable(true))
	postcode?: string;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@Field(() => Int, { nullable: true })
	@is(a.number().nullable(true))
	lat?: number;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@Field(() => Int, { nullable: true })
	@is(a.number().nullable(true))
	lon?: number;
}
