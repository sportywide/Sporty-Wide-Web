import { a } from 'yup-decorator';

export function username() {
	return a
		.string()
		.required('Username is required')
		.max(25, 'Username is too long')
		.min(3, 'Username is too short');
}

export function password() {
	return a
		.string()
		.required('Password is required')
		.min(8, 'Must be greater than 8 characters')
		.matches(
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#_\-?&])[A-Za-z\d@$!%*_\-#?&]{8,}$/,
			'Password must contain letters, numbers and special characters'
		);
}
