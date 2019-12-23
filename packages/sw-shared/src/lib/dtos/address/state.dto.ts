import { schema } from 'yup-decorator';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';

@schema()
export class StateDto {
	@ApiModelProperty()
	id: number | null;

	@ApiModelProperty()
	name: string;

	@ApiModelProperty()
	countryId: number | null;
}
