import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';
import { Creatable, Editable } from '@shared/lib/utils/decorators/permissions';
import { a, is, schema } from 'yup-decorator';
import { password, username } from '@shared/lib/dtos/user/validation/user.yup';

@schema()
export class CreateUserDto {
	@ApiModelProperty()
	@Editable(UserRole.USER)
	@is(
		a
			.string()
			.required('First name is required')
			.max(30, 'First name is too long')
	)
	firstName: string;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@is(a.string().max(30, 'Last name is too long'))
	lastName: string;

	@Creatable(UserRole.USER)
	@ApiModelProperty()
	@is(username())
	username: string;

	@Editable(UserRole.ADMIN) role: UserRole;

	@Editable(UserRole.ADMIN) status: UserStatus;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@is(
		a
			.string()
			.required('Email is required')
			.email('Not a valid email')
	)
	email: string;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@is(password())
	password: string;
}
