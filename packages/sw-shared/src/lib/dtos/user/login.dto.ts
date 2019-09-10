import { is, schema } from 'yup-decorator';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';
import { password, username } from './validation/user.yup';

@schema()
export class LoginDto {
	@ApiModelProperty()
	@is(password({ validatePattern: false }))
	password: string;

	@ApiModelProperty()
	@is(username({ validateLength: false }))
	username: string;
}
