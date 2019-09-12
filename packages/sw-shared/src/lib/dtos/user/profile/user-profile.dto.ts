import { a, is, nested, schema } from 'yup-decorator';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';
import { Editable } from '@shared/lib/utils/decorators/permissions';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { AddressDto } from '@shared/lib/dtos/address/address.dto';
import { Expose, Type } from 'class-transformer-imp';

@schema()
export class UserProfileDto {
	@ApiModelProperty()
	@Expose()
	id: number;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@is(a.string().nullable(true))
	work: string;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@is(a.string().nullable(true))
	education: string;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@is(a.string().nullable(true))
	summary: string;

	@nested()
	@Editable(UserRole.USER)
	@Type(() => AddressDto)
	address: AddressDto;

	@ApiModelProperty()
	@Expose()
	addressId: number;
}
