import { Column, Entity, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';
import { Team } from '@schema/team/models/team.entity';

@Entity()
export class Fixture extends BaseEntity {
	@Column()
	home: string;

	@Column()
	away: string;

	@ManyToOne(type => Team)
	@JoinColumn({
		name: 'home_id',
	})
	homeTeam: Team;

	@JoinColumn({
		name: 'away_id',
	})
	@ManyToOne(type => Team)
	awayTeam: Team;

	@Column()
	season: string;

	@Column()
	homeId: number;

	@Column()
	awayId: number;

	@Column()
	homeScore: number;

	@Column()
	awayScore: number;

	@Column()
	link: string;

	@Column()
	status: string;

	@Column()
	current: number;

	@Column({ type: 'timestamptz' })
	time: Date;
}
