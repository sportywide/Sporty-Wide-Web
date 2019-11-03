import { Column, Entity } from 'typeorm';
import { BaseGeneratedEntity } from '@schema/core/base.entity';

@Entity({
	name: 'states',
})
export class State extends BaseGeneratedEntity {
	@Column()
	name: string;

	@Column()
	countryId: string;
}
