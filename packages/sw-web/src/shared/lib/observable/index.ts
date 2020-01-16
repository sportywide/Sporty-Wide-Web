import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { RethrowError } from '@shared/lib/utils/error';
import { isBrowser } from '@web/shared/lib/environment';
import { logger } from '@web/shared/lib/logging';

export function catchAndThrow(action) {
	return catchError(error => {
		setTimeout(() => {
			if (isBrowser()) {
				throw new RethrowError(error.message, error);
			} else {
				logger.error('Error when handling epic', new RethrowError(error.message, error));
			}
		});
		return of(action(error));
	});
}
