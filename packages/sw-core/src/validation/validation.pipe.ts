import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { cast, validateSync } from 'yup-decorator';
import { ValidateOptions } from 'yup';

@Injectable()
export class YupValidationPipe implements PipeTransform {
	constructor(private readonly validationOptions?: ValidateOptions) {}

	transform(value: any, metadata: ArgumentMetadata) {
		try {
			const validatedValue = validateSync({
				object: value,
				schemaName: metadata.metatype,
				options: this.validationOptions,
			});
			return cast({ object: validatedValue, schemaName: metadata.metatype, options: { stripUnknown: true } });
		} catch (e) {
			throw new BadRequestException(e.message);
		}
	}
}
