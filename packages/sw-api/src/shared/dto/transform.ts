import { BaseEntity } from '@schema/core/base.entity';
import { ClassTransformOptions, plainToClass } from 'class-transformer-imp';

const defaultOptions = {
	excludeExtraneousValues: true,
};
export function toDto({
	value,
	dtoType,
	options = defaultOptions,
}: {
	value: any;
	dtoType: any;
	options?: ClassTransformOptions;
}): typeof dtoType {
	let plain = value;
	if (value instanceof BaseEntity) {
		plain = value.toPlain();
	}

	return plainToClass(dtoType, plain, {
		...defaultOptions,
		...options,
	});
}
