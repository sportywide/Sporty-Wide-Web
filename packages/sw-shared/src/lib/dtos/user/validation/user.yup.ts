import { a } from 'yup-decorator';

export function username(validateLength: boolean = true) {
	const base = a.string().required('Username is required');
	if (validateLength) {
		return base
			.max(25, 'Username is too long')
			.min(3, 'Username is too short');
	}
	return base;
}

export function password(validatePattern: boolean = true) {
	const base = a.string().required('Password is required');
	if (validatePattern) {
		return base
			.min(8, 'Must be greater than 8 characters')
			.matches(
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#_\-?&])[A-Za-z\d@$!%*_\-#?&]{8,}$/,
				'Password must contain letters, numbers and special characters'
			);
	}
	return base;
}
