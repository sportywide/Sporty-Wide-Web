import { a, is, schema } from 'yup-decorator';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';
import { username } from './validation/user.yup';

@schema()
export class CompleteSocialProfileDto {
	@ApiModelProperty()
	@is(username())
	username: string;

	@ApiModelProperty()
	@is(a.string().required('Password is required'))
	password: string;

	@ApiModelProperty()
	@is(
		a
			.string()
			.required('Confirm password is required')
			.oneOf([a.ref('password')], 'Passwords do not match')
	)
	confirmPassword: string;
}
