import { AfterLoad, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { isPromise } from '@shared/lib/utils/promise';

class ChangeTrackingEntity {
	_initialValues: any = {};
	_isLoaded = false;

	@AfterLoad()
	afterLoad() {
		this._initialValues = Object.keys(this)
			.filter(key => !key.toString().startsWith('_') && typeof this[key] !== 'function')
			.reduce((currentObject, key) => {
				return { ...currentObject, [key]: this[key] };
			}, {});
		this._isLoaded = true;
	}

	isLoaded() {
		return this._isLoaded;
	}

	changed(key) {
		return this._initialValues[key] != this[key];
	}

	getChange(key) {
		return { from: this._initialValues[key], to: this[key] };
	}

	toPlain() {
		return toPlainObject(this);
	}

	isResolved(key) {
		return isResolved(this, key);
	}
}

export class BaseGeneratedEntity extends ChangeTrackingEntity {
	@PrimaryGeneratedColumn() id: number;
}

export class BaseEntity extends ChangeTrackingEntity {
	@PrimaryColumn() id: number;
}

function isResolved(entity, key) {
	return isPromise(entity[key]) && entity[`__${key}__`];
}

function toPlainObject(object) {
	if (typeof object === 'function') {
		return null;
	}
	if (!object || typeof object !== 'object') {
		return object;
	}

	if (Array.isArray(object)) {
		return object.map(toPlainObject);
	}

	return Object.keys(object).reduce((currentObject, key) => {
		if (key.toString().startsWith('_')) {
			return currentObject;
		}
		const value = object[key];
		if (typeof value === 'function') {
			return currentObject;
		}
		if (isResolved(object, key)) {
			const resolvedObject = object[`__${key}__`];
			return { ...currentObject, [key]: toPlainObject(resolvedObject) };
		}

		if (value instanceof Date) {
			return { ...currentObject, [key]: value.toISOString() };
		}

		if (isPromise(value)) {
			return currentObject;
		}
		return { ...currentObject, [key]: toPlainObject(value) };
	}, {});
}
