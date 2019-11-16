import { BaseEntity, BaseGeneratedEntity } from '@schema/core/base.entity';
import { ClassTransformOptions, plainToClass } from 'class-transformer-imp';
import { filterValues } from '@shared/lib/utils/object/filter';
import { Type } from '@nestjs/common';

const defaultOptions: ClassTransformOptions = {
	excludeExtraneousValues: true,
	ignoreGroupDecorators: true,
};
export function toDto<T>({
	value,
	dtoType,
	options = defaultOptions,
}: {
	value: any;
	dtoType: Type<T>;
	options?: ClassTransformOptions;
}): T | T[] {
	let plain = value;
	if (Array.isArray(value)) {
		return value.map(
			element =>
				toDto({
					value: element,
					dtoType,
					options,
				}) as T
		);
	}
	if (value instanceof BaseGeneratedEntity || value instanceof BaseEntity) {
		plain = value.toPlain();
	}

	return plainToClass(dtoType, plain, {
		...defaultOptions,
		...options,
	});
}

export function toPlain(object) {
	return filterValues(object, (value, key) => {
		if (typeof value === 'function') {
			return false;
		}
		return !key || !key.toString().startsWith('_');
	});
}
