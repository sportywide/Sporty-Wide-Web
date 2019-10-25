import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';

@Entity()
export class Team extends BaseEntity {
	@Column()
	name: string;

	@Column()
	title: string;

	@Column()
	image: string;

	@Column()
	att: number;

	@Column()
	mid: number;

	@Column()
	def: number;

	@Column()
	ovr: number;

	@Column()
	rating: string;

	@Column()
	league: string;

	@Column()
	leagueId: number;

	@Column('text', { array: true })
	alias: string[];
}
