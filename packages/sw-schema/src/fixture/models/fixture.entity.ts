import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';
import { Team } from '@schema/team/models/team.entity';
import { League } from '@schema/league/models/league.entity';
import { DtoType } from '@shared/lib/dtos/decorators/dto-type.decorator';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';

@DtoType(FixtureDto)
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

	@ManyToOne(() => Team)
	@JoinColumn({
		name: 'home_id',
	})
	homeTeam: Team;

	@JoinColumn({
		name: 'away_id',
	})
	@ManyToOne(() => Team)
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
	@ManyToOne(() => League)
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

	@Column({ type: 'jsonb' })
	incidents: object;

	@Column()
	whoscoreUrl: string;
}
