import { UtilService } from '@web/shared/lib/http/util.service';
import { ucfirst } from '@shared/lib/utils/string/conversion';
import { Debounce } from '@shared/lib/utils/functions/debounce';
import { Sw } from '@web/shared/lib/sw';

export function validateUnique({ table, field, debounceMs = 500 }) {
	const debounce = new Debounce(debounceMs);
	return function(value) {
		const container = Sw.container;
		const utilService = container.get(UtilService);
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

export function validateExists({ table, field, debounceMs = 500 }) {
	const debounce = new Debounce(debounceMs);
	return function(value) {
		const container = Sw.container;
		const utilService = container.get(UtilService);
		if (!value) {
			return;
		}
		return new Promise<void>((resolve, reject) => {
			debounce.run(async () => {
				const exists = !(await utilService.validateUnique({ table, field, value }).toPromise());
				if (exists) {
					resolve();
				} else {
					reject('Email does not exist');
				}
			});
		});
	};
}
