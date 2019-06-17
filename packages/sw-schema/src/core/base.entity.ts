import { Model, PrimaryKey, AutoIncrement, Column, CreatedAt, UpdatedAt } from 'sequelize-typescript';

export class BaseEntity<T extends Model<T>> extends Model<T> {
	@PrimaryKey
	@AutoIncrement
	@Column
	id: number;

	@CreatedAt
	@Column({
		field: 'created_at',
	})
	createdAt: Date;

	@UpdatedAt
	@Column({
		field: 'updated_at',
	})
	updatedAt: Date;
}
