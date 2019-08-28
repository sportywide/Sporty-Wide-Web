import { a } from 'yup-decorator';

export function username() {
	return a
		.string()
		.required('Username is required')
		.max(25, 'Username is too long')
		.min(3, 'Username is too short');
}
