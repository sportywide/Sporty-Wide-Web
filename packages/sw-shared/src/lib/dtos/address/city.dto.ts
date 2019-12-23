import { schema } from 'yup-decorator';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';

@schema()
export class CityDto {
	@ApiModelProperty()
	id: number | null;

	@ApiModelProperty()
	name: string;

	@ApiModelProperty()
	stateId: number | null;
}
