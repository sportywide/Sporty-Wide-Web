import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { hashPassword } from '@shared/lib/utils/crypto';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToOne, JoinColumn } from 'typeorm';
import { SocialProvider } from '@shared/lib/dtos/user/enum/social-provider.enum';
import { BaseEntity } from '@schema/core/base.entity';
import { TrackTimestamp } from '@schema/core/timestamp/track-timestamp.mixin';
import { BadRequestException } from '@nestjs/common';
import { UserGender } from '@shared/lib/dtos/user/enum/user-gender.enum';
import { UserProfile } from '@schema/user/profile/models/user-profile.entity';

@Entity()
export class User extends TrackTimestamp(BaseEntity) {
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

	@Column({
		type: 'enum',
		enum: UserGender,
		default: UserGender.MALE,
	})
	gender: UserStatus;

	@Column() password: string;

	@Column() socialId: string;

	@Column() phone: string;

	@Column({ type: 'date' }) dob: string;

	@Column({
		type: 'enum',
		enum: SocialProvider,
		default: null,
	})
	socialProvider: SocialProvider;

	@Column() refreshToken?: string;

	@OneToOne('UserProfile')
	@JoinColumn({
		name: 'user_profile_id',
	})
	profile: UserProfile;

	@Column({
		name: 'user_profile_id',
	})
	profileId: number;

	get name() {
		return [this.firstName, this.lastName].filter(value => value).join(' ');
	}

	@BeforeInsert()
	@BeforeUpdate()
	async didSaveUser() {
		if (this.changed('password')) {
			this.password = await hashPassword(this.password);
		}

		if (
			this.id &&
			!(this._initialValues.status == UserStatus.PENDING && this._initialValues.socialProvider) &&
			this.changed('username')
		) {
			throw new BadRequestException('Cannot change username');
		}
	}
}
