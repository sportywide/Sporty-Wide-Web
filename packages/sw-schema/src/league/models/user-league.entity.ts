import { BaseGeneratedEntity } from '@schema/core/base.entity';
import { TrackCreated } from '@schema/core/timestamp/track-created.mixin';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@schema/user/models/user.entity';
import { League } from '@schema/league/models/league.entity';
import { UserLeagueDto } from '@shared/lib/dtos/leagues/user-league.dto';
import { DtoType } from '@shared/lib/dtos/decorators/dto-type.decorator';

@DtoType(UserLeagueDto)
@Entity()
export class UserLeague extends TrackCreated(BaseGeneratedEntity) {
	@ManyToOne(type => User, { cascade: ['remove'] })
	@JoinColumn({
		name: 'user_id',
	})
	user: User;

	@Column()
	userId: number;

	@ManyToOne(type => League, { cascade: ['remove'] })
	@JoinColumn({
		name: 'league_id',
	})
	league: League;

	@Column()
	leagueId: number;
}
