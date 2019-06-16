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
} from 'sequelize-typescript';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { hashPassword } from '@shared/lib/utils/crypto';

@Table
export class User extends Model<User> {
	@PrimaryKey
	@AutoIncrement
	@Column
	id: number;

	@Column
	firstName: string;

	@Column
	lastName: string;

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
		if (instance.password) {
			instance.password = hashPassword(instance.password);
		}
	}
}
