import { Inject, Injectable } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { SCHEMA_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { BaseEntityService } from '@schema/core/entity/base-entity.service';
import { PlayerBetting } from '@schema/player/models/player-betting.entity';
import { keyBy } from 'lodash';
import { range } from '@shared/lib/utils/array/range';
import { weekStart } from '@shared/lib/utils/date/relative';
import { Not, IsNull } from 'typeorm';
import { PlayerBettingInputDto } from '@shared/lib/dtos/player/player-betting.dto';

@Injectable()
export class PlayerBettingService extends BaseEntityService<PlayerBetting> {
	constructor(
		@InjectSwRepository(PlayerBetting) private readonly playerBettingRepository: SwRepository<PlayerBetting>,
		@Inject(SCHEMA_LOGGER) private readonly logger: Logger
	) {
		super(playerBettingRepository);
	}

	getBetting({ userId, week, leagueId }, includes = []) {
		week = weekStart(week);
		return this.playerBettingRepository.find({
			where: {
				userId,
				week,
				leagueId,
			},
			relations: includes,
		});
	}

	async hasBetting({ userId, week, leagueId }) {
		week = weekStart(week);
		return (
			(await this.playerBettingRepository.count({
				where: {
					userId,
					week,
					leagueId,
				},
			})) > 0
		);
	}

	async hasAlreadyBet({ userId, week, leagueId }) {
		week = weekStart(week);
		return (
			(await this.playerBettingRepository.count({
				where: {
					userId,
					week,
					leagueId,
					betTime: Not(IsNull()),
				},
			})) > 0
		);
	}

	async getBettingPositions({ userId, week, leagueId }) {
		week = weekStart(week);
		const rows = await this.repository.advancedFindSelect(['player_id', 'pos'], {
			userId,
			week,
			leagueId,
		});
		const positionMap = keyBy(rows, 'pos');
		return range(11).map(index => {
			if (positionMap[index]) {
				return positionMap[index].player_id;
			} else {
				return null;
			}
		});
	}

	async saveUserBetting({
		playerBetting,
		userId,
		leagueId,
	}: {
		playerBetting: PlayerBettingInputDto[];
		userId: number;
		leagueId: number;
	}) {
		const existingBetting = await this.getBetting({ userId, leagueId, week: weekStart(new Date()) });
		const playerBettingMap = keyBy(playerBetting, 'playerId');
		const currentDate = new Date();

		for (const bettingDb of existingBetting) {
			const betting = playerBettingMap[bettingDb.playerId];
			if (betting) {
				bettingDb.betRating = betting.betRating;
				bettingDb.betTokens = betting.betTokens;
				bettingDb.betTime = currentDate;
			} else {
				bettingDb.betTime = currentDate;
			}
		}
		return this.repository.save(existingBetting);
	}
}
