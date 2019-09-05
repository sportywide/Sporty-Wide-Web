import { a, is, schema } from 'yup-decorator';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';
import { password } from './validation/user.yup';

@schema()
export class ResetPasswordDto {
	@ApiModelProperty()
	@is(password())
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
