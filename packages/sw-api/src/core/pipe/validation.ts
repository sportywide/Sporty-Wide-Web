import { YupValidationPipe } from '@core/validation/validation.pipe';
import { defaultValidationOptions } from '@shared/lib/utils/validation';

export function getValidationPipe(options = {}) {
	return new YupValidationPipe({
		...defaultValidationOptions,
		...options,
	});
}
