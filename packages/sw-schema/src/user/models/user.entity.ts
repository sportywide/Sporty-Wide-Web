import {
	Table,
	Column,
	Model,
	CreatedAt,
	UpdatedAt,
	PrimaryKey,
	AutoIncrement,
	BeforeCreate,
	BeforeUpdate,
	Default,
	DataType,
	Unique,
} from 'sequelize-typescript';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { hashPassword } from '@shared/lib/utils/crypto';

@Table({
	tableName: 'user',
})
export class User extends Model<User> {
	@PrimaryKey
	@AutoIncrement
	@Column
	id: number;

	@Column
	firstName: string;

	@Column
	lastName: string;

	@Unique({
		name: 'uq_user_email',
		msg: 'Email is already chosen',
	})
	@Column
	email: string;

	@Default('USER')
	@Column(DataType.ENUM('ADMIN', 'USER'))
	role: UserRole;

	@Default('PENDING')
	@Column(DataType.ENUM('PENDING', 'ACTIVE'))
	status: UserStatus;

	@Column
	password: string;

	@CreatedAt
	creationDate: Date;

	@UpdatedAt
	updatedOn: Date;

	@BeforeCreate
	@BeforeUpdate
	static hashPassword(instance: User) {
		if (instance.changed('password')) {
			instance.set('password', hashPassword(instance.get('password')));
		}
	}
}
