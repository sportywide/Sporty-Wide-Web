import { YupValidationPipe } from '@core/validation/validation.pipe';

export function getValidationPipe(options = {}) {
	return new YupValidationPipe({
		abortEarly: true,
		stripUnknown: true,
		strict: true,
		...options,
	});
}
