import { Table, Column, BeforeCreate, BeforeUpdate, Default, DataType, Unique } from 'sequelize-typescript';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { hashPassword } from '@shared/lib/utils/crypto';
import { BaseEntity } from '@schema/core/base.entity';

@Table({
	tableName: 'user',
})
export class User extends BaseEntity<User> {
	@Column({
		field: 'first_name',
	})
	firstName: string;

	@Column({
		field: 'last_name',
	})
	lastName: string;

	@Unique({
		name: 'uq_user_email',
		msg: 'Email is already chosen',
	})
	@Column
	email: string;

	@Default('USER')
	@Column({
		field: 'user_role',
		type: DataType.ENUM('ADMIN', 'USER'),
	})
	role: UserRole;

	@Default('PENDING')
	@Column({
		field: 'user_status',
		type: DataType.ENUM('PENDING', 'ACTIVE'),
	})
	status: UserStatus;

	@Column
	password: string;

	@BeforeCreate
	@BeforeUpdate
	static hashPassword(instance: User) {
		if (instance.changed('password')) {
			instance.set('password', hashPassword(instance.get('password')));
		}
	}
}
