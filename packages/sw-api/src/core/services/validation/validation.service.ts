import { BadRequestException, Injectable } from '@nestjs/common';
import { RequestContextService } from '@api/core/services/request/request-context.service';
import { defaultValidationOptions } from '@shared/lib/utils/validation';
import { validate } from 'yup-decorator';
import { plainToClass } from 'class-transformer-imp';
import { getEditableGroupsForUser } from '@shared/lib/utils/decorators/permissions';
import { merge } from 'lodash';

@Injectable()
export class ApiValidationService {
	constructor(private readonly requestContextService: RequestContextService) {}

	async validatePatch({ patch, objectType, originalValues, validationOptions = {} }) {
		try {
			const strippedValues = plainToClass(objectType, patch, {
				ignoreUndefinedValues: true,
				excludeExtraneousValues: true,
				groups: getEditableGroupsForUser(this.requestContextService.getCurrentUser()),
			});

			const updatedObject = merge(originalValues, strippedValues);

			return await validate({
				object: updatedObject,
				schemaName: objectType,
				options: {
					...defaultValidationOptions,
					...validationOptions,
				},
			});
		} catch (e) {
			throw new BadRequestException(e.message);
		}
	}
}
