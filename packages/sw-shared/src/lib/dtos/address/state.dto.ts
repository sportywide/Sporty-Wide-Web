import { schema } from 'yup-decorator';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';
import { Expose } from 'class-transformer-imp';

@schema()
export class StateDto {
	@ApiModelProperty()
	@Expose()
	id: number | null;

	@ApiModelProperty()
	@Expose()
	name: string;

	@ApiModelProperty()
	@Expose()
	countryId: number | null;
}
