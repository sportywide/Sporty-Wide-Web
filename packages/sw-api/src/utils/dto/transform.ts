import { BaseEntity, BaseGeneratedEntity } from '@schema/core/base.entity';
import { ClassTransformOptions, plainToClass } from 'class-transformer-imp';
import { filterValues } from '@shared/lib/utils/object/filter';
import { Type } from '@nestjs/common';
import { Document } from 'mongoose';
import { getDtoType } from '@shared/lib/dtos/decorators/dto-type.decorator';

const defaultOptions: ClassTransformOptions = {
	excludeExtraneousValues: true,
	ignoreGroupDecorators: true,
	useProperties: true,
};
export function toDto<T>({
	value,
	dtoType,
	options = defaultOptions,
}: {
	value: any;
	dtoType?: Type<T>;
	options?: ClassTransformOptions;
}) {
	if (!value) {
		return value;
	}
	let plain = value;
	const prototype = Object.getPrototypeOf(value);
	dtoType = dtoType || getDtoType(prototype && prototype.constructor);
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

	if (value instanceof Document) {
		plain = (value as any).toJSON();
	} else if (value instanceof BaseGeneratedEntity || value instanceof BaseEntity) {
		plain = value.toPlain();
	} else if (!dtoType && typeof value === 'object') {
		return Object.entries(value).reduce((currentObject, [key, value]) => {
			return {
				...currentObject,
				[key]: toDto({
					value: value,
					options,
				}),
			};
		}, {});
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
