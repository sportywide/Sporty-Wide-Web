import { QueryFailedError } from 'typeorm';
import { toCamel, ucfirst } from '@shared/lib/utils/string/conversion';

export function getFriendlyErrorMessage(err: QueryFailedError) {
	switch ((err as any).code) {
		case 'ER_DUP_ENTRY':
			const matches = /Duplicate entry '(.*?)' for key '(.*?)'/.exec(err.message);
			if (!matches) {
				return err.message;
			}
			const [, value, constraint] = matches;
			const fieldName = constraint.split('_')[2];
			return `${ucfirst(toCamel(fieldName))} '${value}' is already taken`;
		default:
			return err.message;
	}
}
