import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { ApiModelProperty } from '@shared/lib/utils/api/decorators';
import { Creatable, Editable } from '@shared/lib/utils/decorators/permissions';
import { a, is, schema } from 'yup-decorator';
import { password, username } from '@shared/lib/dtos/user/validation/user.yup';
import { UserGender } from '@shared/lib/dtos/user/enum/user-gender.enum';
import { date } from '@shared/lib/utils/validation/date.yup';

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

	@ApiModelProperty()
	@is(a.string().oneOf([undefined, a.ref('password')], 'Password do not match'))
	confirmPassword: string;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@is(date({ nullable: true }))
	dob: string;

	@ApiModelProperty()
	@Editable(UserRole.USER)
	@is(a.string().nullable(true))
	phone: string;

	@ApiModelProperty({ enum: ['male', 'female', 'other'] })
	@Editable(UserRole.USER)
	@is(
		a
			.string()
			.nullable(true)
			.oneOf(Object.values(UserGender))
	)
	gender: UserGender;
}
