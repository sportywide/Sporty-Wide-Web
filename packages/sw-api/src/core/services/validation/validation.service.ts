import { BadRequestException, Injectable, Optional } from '@nestjs/common';
import { RequestContextService } from '@api/core/services/request/request-context.service';
import { defaultValidationOptions } from '@shared/lib/utils/validation';
import { validate } from 'yup-decorator';
import { plainToClass } from 'class-transformer-imp';
import { getEditableGroupsForUser } from '@shared/lib/utils/decorators/permissions';
import { merge } from 'lodash';
import { filterValues } from '@shared/lib/utils/object/filter';
import { isPromise } from '@shared/lib/utils/promise';

@Injectable()
export class ApiValidationService {
	constructor(@Optional() private readonly requestContextService: RequestContextService | undefined) {}

	async validatePatch({
		patch,
		objectType,
		originalValues,
		validationOptions = {},
		user = this.requestContextService && this.requestContextService.getCurrentUser(),
	}) {
		try {
			const strippedValues = this.strip({ objectType, value: patch, user });
			const mergeValue = filterValues(merge(originalValues, strippedValues), value => !isPromise(value));
			const updatedObject = plainToClass(objectType, mergeValue, {
				ignoreDecorators: true,
			});

			return this.validate({
				object: updatedObject,
				schemaName: objectType,
				options: validationOptions,
			});
		} catch (e) {
			throw new BadRequestException(e.message);
		}
	}

	strip({
		objectType,
		value,
		user = this.requestContextService && this.requestContextService.getCurrentUser(),
	}): Partial<typeof objectType> {
		return plainToClass(objectType, value, {
			ignoreUndefinedValues: true,
			excludeExtraneousValues: true,
			groups: getEditableGroupsForUser(user),
		});
	}

	validate({ object, schemaName, options: validationOptions = {} }) {
		return validate({
			object,
			schemaName,
			options: {
				...defaultValidationOptions,
				...validationOptions,
			},
		});
	}
}
