import { BaseEntity } from '@schema/core/base.entity';
import { TrackCreated } from '@schema/core/timestamp/track-created.mixin';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@schema/user/models/user.entity';
import { League } from '@schema/league/models/league.entity';

@Entity()
export class UserLeague extends TrackCreated(BaseEntity) {
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
