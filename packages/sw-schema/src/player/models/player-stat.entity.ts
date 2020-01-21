import { PlayerStatDto } from '@shared/lib/dtos/player/player-stat.dto';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';
import { TrackTimestamp } from '@schema/core/timestamp/track-timestamp.mixin';
import { Player } from '@schema/player/models/player.entity';
import { Team } from '@schema/team/models/team.entity';
import { DtoType } from '@shared/lib/dtos/decorators/dto-type.decorator';

@DtoType(PlayerStatDto)
@Entity()
export class PlayerStat extends TrackTimestamp(BaseEntity) {
	@Column()
	played: number;

	@Column()
	scored: number;

	@Column()
	yellow: number;

	@Column()
	red: number;

	@Column()
	chance: number;

	@Column()
	season: string;

	@Column()
	playerId: number;

	@Column()
	teamId: number;

	@Column()
	leagueId: number;

	@Column()
	status: string;

	@ManyToOne(() => Team)
	@JoinColumn({
		name: 'team_id',
	})
	team: Team;

	@ManyToOne(() => Player)
	@JoinColumn({
		name: 'player_id',
	})
	player: Player;
}
