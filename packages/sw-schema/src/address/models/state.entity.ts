import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';

@Entity({
	name: 'states',
})
export class State extends BaseEntity {
	@Column()
	name: string;

	@Column()
	countryId: string;
}
