import { UtilService } from '@web/shared/lib/http/util.service';
import { ucfirst } from '@shared/lib/utils/string/conversion';
import { Container } from 'typedi';
import { Debounce } from '@shared/lib/utils/functions/debounce';

export function validateUnique({ table, field, debounceMs = 500 }) {
	const utilService = Container.get(UtilService);
	const debounce = new Debounce(debounceMs);

	return function(value) {
		if (!value) {
			return;
		}
		return new Promise<void>((resolve, reject) => {
			debounce.run(async () => {
				const isUnique = await utilService.validateUnique({ table, field, value }).toPromise();
				if (isUnique) {
					resolve();
				} else {
					reject(`${ucfirst(field)} is already taken`);
				}
			});
		});
	};
}
