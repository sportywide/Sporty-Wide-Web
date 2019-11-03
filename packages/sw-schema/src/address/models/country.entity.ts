import { Column, Entity } from 'typeorm';
import { BaseGeneratedEntity } from '@schema/core/base.entity';

@Entity({
	name: 'countries',
})
export class Country extends BaseGeneratedEntity {
	@Column()
	sortname: string;

	@Column()
	name: string;

	@Column()
	phonecode: number;
}
