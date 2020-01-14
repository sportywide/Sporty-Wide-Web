import { Inject, Injectable } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { SCHEMA_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { BaseEntityService } from '@schema/core/entity/base-entity.service';
import { PlayerBetting } from '@schema/player/models/player-betting.entity';
import { keyBy } from 'lodash';
import { range } from '@shared/lib/utils/array/range';
import { startOfWeek } from 'date-fns';

@Injectable()
export class PlayerBettingService extends BaseEntityService<PlayerBetting> {
	constructor(
		@InjectSwRepository(PlayerBetting) private readonly playerBettingRepository: SwRepository<PlayerBetting>,
		@Inject(SCHEMA_LOGGER) private readonly logger: Logger
	) {
		super(playerBettingRepository);
	}

	getBetting({ userId, week, leagueId }, includes = []) {
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
		week = startOfWeek(week, { weekStartsOn: 1 });
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

	async getBettingPositions({ userId, week, leagueId }) {
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
}
