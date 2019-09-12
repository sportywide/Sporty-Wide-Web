import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';
import { Address } from '@schema/address/models/address.entity';

@Entity()
export class UserProfile extends BaseEntity {
	@Column()
	summary: string;

	@Column()
	work: string;

	@Column()
	education: string;

	@Column()
	addressId: number;

	@OneToOne(type => Address, { cascade: true, primary: true, lazy: true })
	@JoinColumn({
		name: 'address_id',
		referencedColumnName: 'id',
	})
	address: Promise<Address>;
}
