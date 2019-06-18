import { ValidationPipe } from '@nestjs/common';

export function getValidationPipe(options = {}) {
	return new ValidationPipe({
		transform: true,
		whitelist: true,
		validationError: {
			target: false,
		},
		...options,
	});
}
