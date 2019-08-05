import { AfterLoad, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
	_initialValues = {};

	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;

	@AfterLoad()
	afterLoad() {
		this._initialValues = Object.keys(this)
			.filter(key => !key.startsWith('_') && typeof this[key] !== 'function')
			.reduce((currentObject, key) => {
				return { ...currentObject, [key]: this[key] };
			}, {});
	}

	changed(key) {
		return this._initialValues[key] !== this[key];
	}

	getChange(key) {
		return { from: this._initialValues[key], to: this[key] };
	}
}
