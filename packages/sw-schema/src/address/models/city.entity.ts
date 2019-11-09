import { Column, Entity } from 'typeorm';
import { BaseGeneratedEntity } from '@schema/core/base.entity';

@Entity({
	name: 'cities',
})
export class City extends BaseGeneratedEntity {
	@Column()
	name: string;

	@Column()
	stateId: string;
}
