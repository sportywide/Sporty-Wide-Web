import { mapTo, catchError } from 'rxjs/operators';

export function catchAndThrow(action) {
	return catchError(error => {
		setTimeout(() => {
			throw error;
		});
		return mapTo(action);
	});
}
