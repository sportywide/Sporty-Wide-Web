import { ValidateOptions } from 'yup';

export const defaultValidationOptions: ValidateOptions = {
	strict: true,
	abortEarly: true,
	stripUnknown: true,
};
