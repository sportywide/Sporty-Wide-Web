import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';

@Entity()
export class Address extends BaseEntity {
	@Column({
		name: 'street1',
	})
	street1: string;

	@Column({
		name: 'street2',
	})
	street2: string;

	@Column()
	state: string;

	@Column()
	city: string;

	@Column()
	country: string;

	@Column()
	suburb: string;

	@Column()
	postcode: string;

	@Column()
	lat: number;

	@Column()
	lon: number;
}
