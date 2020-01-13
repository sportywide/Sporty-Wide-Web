import { Entity, Column } from 'typeorm';
import { BaseGeneratedEntity } from '@schema/core/base.entity';
import { TrackTimestamp } from '@schema/core/timestamp/track-timestamp.mixin';

@Entity()
export class UserScore extends TrackTimestamp(BaseGeneratedEntity) {
	@Column()
	userId: number;

	@Column()
	leagueId: number;

	@Column()
	tokens: number;

	@Column()
	season: string;
}
