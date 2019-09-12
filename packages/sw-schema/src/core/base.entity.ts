import { AfterLoad, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity {
	_initialValues: any = {};

	@PrimaryGeneratedColumn() id: number;

	@AfterLoad()
	afterLoad() {
		this._initialValues = Object.keys(this)
			.filter(key => !key.startsWith('_') && typeof this[key] !== 'function')
			.reduce((currentObject, key) => {
				return { ...currentObject, [key]: this[key] };
			}, {});
	}

	changed(key) {
		return this._initialValues[key] != this[key];
	}

	getChange(key) {
		return { from: this._initialValues[key], to: this[key] };
	}
}
