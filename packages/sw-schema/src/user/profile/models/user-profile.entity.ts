import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';
import { Address } from '@schema/address/models/address.entity';
import { User } from '@schema/user/models/user.entity';

@Entity()
export class UserProfile extends BaseEntity {
	@Column()
	summary: string;

	@Column()
	work: string;

	@Column()
	education: string;

	@Column()
	address_id: number;

	@OneToOne(type => Address, { lazy: true, cascade: true })
	@JoinColumn({
		name: 'address_id',
	})
	address: Address;

	user: User;
}
