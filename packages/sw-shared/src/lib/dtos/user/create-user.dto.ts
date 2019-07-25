import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { ApiModelProperty } from '@nestjs/swagger';
import { Creatable, Editable } from '@shared/lib/utils/decorators/permissions';
import { a, is, schema } from 'yup-decorator';

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
	@is(
		a
			.string()
			.required('Username is required')
			.max(25, 'Username is too long')
			.min(3, 'Username is too short')
	)
	username: string;

	@Editable(UserRole.ADMIN)
	role: UserRole;

	@Editable(UserRole.ADMIN)
	status: UserStatus;

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
	@is(a.string().required('Password is required'))
	password: string;
}
