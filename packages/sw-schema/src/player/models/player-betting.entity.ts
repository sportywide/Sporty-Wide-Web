import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@schema/core/base.entity';
import { TrackTimestamp } from '@schema/core/timestamp/track-timestamp.mixin';
import { Fixture } from '@schema/fixture/models/fixture.entity';
import { User } from '@schema/user/models/user.entity';
import { Player } from '@schema/player/models/player.entity';

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

	@Column()
	calculated: boolean;

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

	@ManyToOne(type => Player)
	@JoinColumn({
		name: 'player_id',
	})
	player: Player;
}
