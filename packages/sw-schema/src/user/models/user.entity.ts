import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { hashPassword } from '@shared/lib/utils/crypto';
import { BaseEntity } from '@schema/core/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index } from 'typeorm';
import { SocialProvider } from '@shared/lib/dtos/user/enum/social-provider.enum';

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
	socialId: string;

	@Column({
		type: 'enum',
		enum: SocialProvider,
		default: null,
	})
	socialProvider: SocialProvider;

	@Column()
	refreshToken?: string;

	@BeforeInsert()
	@BeforeUpdate()
	didSaveUser() {
		if (this.changed('password')) {
			this.password = hashPassword(this.password);
		}

		if (this.id && this.changed('username')) {
			throw new Error('Cannot change username');
		}
	}

	get name() {
		return [this.firstName, this.lastName].filter(value => value).join(' ');
	}
}
