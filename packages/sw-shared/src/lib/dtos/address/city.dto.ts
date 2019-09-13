import { schema } from 'yup-decorator';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';
import { Expose } from 'class-transformer-imp';

@schema()
export class CityDto {
	@ApiModelProperty()
	@Expose()
	id: number | null;

	@ApiModelProperty()
	@Expose()
	name: string;

	@ApiModelProperty()
	@Expose()
	stateId: number | null;
}
