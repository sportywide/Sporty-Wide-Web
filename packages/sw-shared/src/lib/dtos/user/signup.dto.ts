import { schema, is, a } from 'yup-decorator';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';
import { password, username } from '@shared/lib/dtos/user/validation/user.yup';

@schema()
export class SignupDto {
	@ApiModelProperty()
	@is(username())
	username: string;

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
