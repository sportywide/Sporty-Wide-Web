import { a } from 'yup-decorator';
import { isDateInFormat } from '@shared/lib/utils/date/validation';

export function date({ nullable, format = 'yyyy-MM-dd' }) {
	return a
		.string()
		.nullable(nullable)
		.test('isValid', 'Not a valid date', value => {
			if (value == null) {
				return true;
			}
			return isDateInFormat(value, format);
		});
}
