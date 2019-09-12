import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';

@Entity({
	name: 'cities',
})
export class City extends BaseEntity {
	@Column()
	name: string;

	@Column()
	stateId: string;
}
