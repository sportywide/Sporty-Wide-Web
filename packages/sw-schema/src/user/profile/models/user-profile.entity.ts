import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseGeneratedEntity } from '@schema/core/base.entity';
import { Address } from '@schema/address/models/address.entity';
import { User } from '@schema/user/models/user.entity';

@Entity()
export class UserProfile extends BaseGeneratedEntity {
	@Column()
	summary: string;

	@Column()
	work: string;

	@Column()
	education: string;

	@Column()
	addressId: number;

	@OneToOne(type => Address, { cascade: true })
	@JoinColumn({
		name: 'address_id',
	})
	address: Address;

	@Column()
	userId: number;

	@OneToOne(type => User)
	@JoinColumn({
		name: 'user_id',
	})
	user: User;
}
