import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';
import { TrackTimestamp } from '@schema/core/timestamp/track-timestamp.mixin';
import { Fixture } from '@schema/fixture/models/fixture.entity';
import { User } from '@schema/user/models/user.entity';
import { Player } from '@schema/player/models/player.entity';
import { Team } from '@schema/team/models/team.entity';
import { DtoType } from '@shared/lib/dtos/decorators/dto-type.decorator';
import { PlayerBettingDto } from '@shared/lib/dtos/player/player-betting.dto';
import { PlayerBettingStatus } from '@shared/lib/dtos/player/enum/player-betting.enum';
import { UserRole } from '@shared/lib/dtos/user/enum/user-role.enum';

@DtoType(PlayerBettingDto)
@Entity()
export class PlayerBetting extends TrackTimestamp(BaseEntity) {
	@Column()
	betRating: number;

	@Column()
	pos: number;

	@Column()
	realRating: number;

	@Column()
	betTokens: number;

	@Column()
	earnedTokens: number;

	@Column({ type: 'date' })
	week: string;

	@Column()
	fixtureId: number;

	@Column()
	userId: number;

	@Column()
	playerId: number;

	@Column()
	teamId: number;

	@Column({ type: 'timestamptz' })
	betTime: Date;

	@Column({
		type: 'enum',
		enum: PlayerBettingStatus,
		default: PlayerBettingStatus.PENDING,
	})
	status: PlayerBettingStatus;

	@Column()
	leagueId: number;

	@ManyToOne(type => Fixture)
	@JoinColumn({
		name: 'fixture_id',
	})
	fixture: Fixture;

	@ManyToOne(type => User)
	@JoinColumn({
		name: 'user_id',
	})
	user: User;

	@ManyToOne(type => Team)
	@JoinColumn({
		name: 'team_id',
	})
	team: Team;

	@ManyToOne(type => Player)
	@JoinColumn({
		name: 'player_id',
	})
	player: Player;
}
