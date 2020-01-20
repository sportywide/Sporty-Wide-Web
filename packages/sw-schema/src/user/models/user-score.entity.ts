import { Entity, Column } from 'typeorm';
import { BaseGeneratedEntity } from '@schema/core/base.entity';
import { TrackTimestamp } from '@schema/core/timestamp/track-timestamp.mixin';
import { DtoType } from '@shared/lib/dtos/decorators/dto-type.decorator';
import { UserScoreDto } from '@shared/lib/dtos/user/user-score.dto';

@DtoType(UserScoreDto)
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
