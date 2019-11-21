import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity, BaseGeneratedEntity } from '@schema/core/base.entity';
import { Team } from '@schema/team/models/team.entity';
import { League } from '@schema/league/models/league.entity';

@Entity()
export class Fixture extends BaseEntity {
	@Column()
	home: string;

	@Column()
	away: string;

	@Column()
	homeFixture: number;

	@Column()
	awayFixture: number;

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
	leagueId: number;

	@JoinColumn({
		name: 'league_id',
	})
	@ManyToOne(type => League)
	league: League;

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
