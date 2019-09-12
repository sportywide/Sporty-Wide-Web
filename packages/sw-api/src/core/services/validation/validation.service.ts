import { BadRequestException, Injectable, Optional } from '@nestjs/common';
import { RequestContextService } from '@api/core/services/request/request-context.service';
import { defaultValidationOptions } from '@shared/lib/utils/validation';
import { validate } from 'yup-decorator';
import { plainToClass } from 'class-transformer-imp';
import { getEditableGroupsForUser } from '@shared/lib/utils/decorators/permissions';
import { filterValues } from '@shared/lib/utils/object/filter';
import { isPromise } from '@shared/lib/utils/promise';
import { BaseEntity } from '@schema/core/base.entity';
import { mergeConcatArray } from '@shared/lib/utils/object/merge';

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
			if (isPromise(originalValues)) {
				originalValues = await originalValues;
			}
			if (originalValues instanceof BaseEntity) {
				originalValues = originalValues.toPlain();
			}
			const strippedValues = this.strip({ objectType, value: patch, user });
			const mergeValue = filterValues(
				mergeConcatArray(originalValues, strippedValues),
				value => !isPromise(value)
			);
			const updatedObject = filterValues(
				plainToClass(objectType, mergeValue, {
					ignoreDecorators: true,
				}),
				value => value !== undefined
			);

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
		return filterValues(
			plainToClass(objectType, value, {
				excludeExtraneousValues: true,
				groups: getEditableGroupsForUser(user),
			}),
			value => value !== undefined
		);
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
