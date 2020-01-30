import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'log4js';
import { Interval } from '@nestjs/schedule';
import { PlayerBettingService } from '@schema/player/services/player-betting.service';
import { UserScoreService } from '@schema/user/services/user-score.service';
import { EMAIL_LOGGER } from '@core/logging/logging.constant';
import { last } from 'lodash';
import { SwSelectQueryBuilder } from '@schema/core/repository/sql/base.repository';
import { PlayerBetting } from '@schema/player/models/player-betting.entity';

@Injectable()
export class ScoreService {
	constructor(
		private readonly playerBettingService: PlayerBettingService,
		private readonly userScoreService: UserScoreService,
		@Inject(EMAIL_LOGGER) private readonly logger: Logger
	) {}

	@Interval(1000 * 6)
	async updateScore() {
		this.logger.info('Calculating scores');
		const updateResult = await this.playerBettingService.progressPendingBetting();
		if (!updateResult.affected) {
			this.logger.info('Nothing to process');
			return;
		}
		this.logger.info(`Processing ${updateResult.affected} betting`);
		const queryBuilder: SwSelectQueryBuilder<PlayerBetting> = this.playerBettingService.getUserIdQueryBuilder();
		do {
			const rows = await queryBuilder.getRawMany();
			if (!rows.length) {
				break;
			}
			const lastRow = last(rows);
			queryBuilder.andWhere('user_id > :lastUserId', {
				lastUserId: lastRow.userId,
			});
			const userIds = rows.map(row => row.userId);
			await this.userScoreService.updateUserScore(userIds);
			await this.playerBettingService.completeBettingForUserIds(userIds);
		} while (true);
		this.logger.info(`Done processing betting`);
	}
}
