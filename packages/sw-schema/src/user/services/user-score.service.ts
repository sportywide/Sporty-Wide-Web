import { Injectable } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { BaseEntityService } from '@schema/core/entity/base-entity.service';
import { UserScore } from '@schema/user/models/user-score.entity';

const DEFAULT_TOKENS = 100;

@Injectable()
export class UserScoreService extends BaseEntityService<UserScore> {
	constructor(@InjectSwRepository(UserScore) private readonly userScoreRepository: SwRepository<UserScore>) {
		super(userScoreRepository);
	}

	async newUserScore({ userId, leagueId, season }) {
		const userScore = await this.repository.findOne({
			where: {
				userId,
				leagueId,
				season,
			},
		});
		if (userScore) {
			return userScore;
		}
		return this.repository.save({
			leagueId,
			season,
			userId,
			tokens: DEFAULT_TOKENS,
		});
	}

	async decrementTokens({ userId, leagueId, season, tokens }) {
		await this.repository.decrement(
			{
				userId,
				leagueId,
				season,
			},
			'tokens',
			tokens
		);
	}

	async updateUserScore(userIds = []) {
		if (!userIds.length) {
			return;
		}
		await this.repository.manager.query(`
			update
				user_score
			set
				tokens = tokens + coalesce(
					(
						select
							sum(player_betting.earned_tokens)
						from
							player_betting
						where
							player_betting.league_id = user_score.league_id
							and player_betting.status = 'calculating'
						group by
							player_betting.user_id
					), 0
				)
			where
				user_id in (${userIds.join(',')})
		`);
	}
}
