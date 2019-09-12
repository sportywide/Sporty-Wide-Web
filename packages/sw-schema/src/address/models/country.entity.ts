import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';

@Entity({
	name: 'countries',
})
export class Country extends BaseEntity {
	@Column()
	sortname: string;

	@Column()
	name: string;

	@Column()
	phonecode: number;
}
