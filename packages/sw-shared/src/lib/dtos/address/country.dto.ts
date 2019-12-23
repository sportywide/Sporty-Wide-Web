import { schema } from 'yup-decorator';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';

@schema()
export class CountryDto {
	@ApiModelProperty()
	id: number | null;

	@ApiModelProperty()
	sortname: string | null;

	@ApiModelProperty()
	name: string;

	@ApiModelProperty()
	phonecode: string | null;
}
