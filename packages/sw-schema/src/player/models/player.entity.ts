import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';

@Entity()
export class Player extends BaseEntity {
	@Column()
	name: string;

	@Column()
	url: string;

	@Column()
	image: string;

	@Column()
	rating: number;

	@Column()
	age: number;

	@Column()
	positions: string;

	@Column()
	teamId: number;

	@Column()
	team: string;

	@Column()
	nationality: string;

	@Column()
	nationalityId: number;
}
