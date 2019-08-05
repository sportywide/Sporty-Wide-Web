import { QueryFailedError } from 'typeorm';
import { ucfirst } from '@shared/lib/utils/string/conversion';
const ER_DUP_ENTRY = '23505';

export function getFriendlyErrorMessage(err: QueryFailedError) {
	switch ((err as any).code) {
		case ER_DUP_ENTRY:
			const matches = /Key \((.*)\)=\((.*)\) already exists/.exec((err as any).detail);
			if (!matches) {
				return err.message;
			}
			const [, keys] = matches;
			const fieldNames = keys.split('.');
			return ucfirst(fieldNames.join(' and ') + ' already ' + (fieldNames.length > 1 ? 'exists' : 'exist'));
		default:
			return err.message;
	}
}
