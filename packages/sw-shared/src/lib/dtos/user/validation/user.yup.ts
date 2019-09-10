import { a } from 'yup-decorator';

interface IUsernameValidationOptions {
	validateLength?: boolean;
}

const defaultUsernameValidationOptions = {
	validateLength: true,
};

export function username(options: IUsernameValidationOptions = defaultUsernameValidationOptions) {
	const base = a.string().required('Username is required');
	if (options.validateLength) {
		return base
			.max(25, 'Username is too long')
			.min(3, 'Username is too short');
	}
	return base;
}

interface IPasswordValidationOptions {
	validatePattern?: boolean;
}

const defaultPasswordValidationOptions = {
	validatePattern: true,
};

export function password(options: IPasswordValidationOptions = defaultPasswordValidationOptions) {
	const base = a.string().required('Password is required');
	if (options.validatePattern) {
		return base
			.min(8, 'Must be greater than 8 characters')
			.matches(
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#_\-?&])[A-Za-z\d@$!%*_\-#?&]{8,}$/,
				'Password must contain letters, numbers and special characters'
			);
	}
	return base;
}
