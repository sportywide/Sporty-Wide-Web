import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { hashPassword } from '@shared/lib/utils/crypto';
import { BaseEntity } from '@schema/core/base.entity';
import { Entity, Column, Index, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class User extends BaseEntity {
	@Column({
		length: 30,
	})
	firstName: string;

	@Column({
		length: 30,
	})
	lastName: string;

	@Index({ unique: true })
	@Column({
		length: 50,
	})
	email: string;

	@Index({ unique: true })
	@Column({
		length: 25,
	})
	username: string;

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.USER,
	})
	role: UserRole;

	@Column({
		type: 'enum',
		enum: UserStatus,
		default: UserStatus.PENDING,
	})
	status: UserStatus;

	@Column()
	password: string;

	@Column()
	refreshToken?: string;

	@BeforeInsert()
	@BeforeUpdate()
	hashPassword() {
		if (this.changed('password')) {
			this.password = hashPassword(this.password);
		}
	}

	get name() {
		return [this.firstName, this.lastName].filter(value => value).join(' ');
	}
}
