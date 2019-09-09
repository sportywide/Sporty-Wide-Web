import { is, schema } from 'yup-decorator';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';
import { password, username } from './validation/user.yup';

@schema()
export class LoginDto {
	@ApiModelProperty()
	@is(password(false))
	password: string;

	@ApiModelProperty()
	@is(username(false))
	username: string;
}
