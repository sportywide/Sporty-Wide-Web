import { BaseEntity } from '@schema/core/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class League extends BaseEntity {
	@Column()
	name: string;

	@Column()
	title: string;

	@Column()
	image: string;
}
