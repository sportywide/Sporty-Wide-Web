import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Team {
	@PrimaryColumn()
	id: number;

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
}
