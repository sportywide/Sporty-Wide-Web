import { FormationDto, formationMap } from '@shared/lib/dtos/formation/formation.dto';
import { randomCfRange } from '@shared/lib/utils/random/probability';
import { range } from '@shared/lib/utils/array/range';
import { Inject, Injectable } from '@nestjs/common';
import { Player } from '@schema/player/models/player.entity';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { Fixture } from '@schema/fixture/models/fixture.entity';
import { Brackets, In } from 'typeorm';
import { max, min } from 'lodash';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserPlayersDocument } from '@schema/player/models/user-players.schema';
import { getSeason } from '@shared/lib/utils/season';
import { UserLeaguePreferenceService } from '@schema/league/services/user-league-preference.service';
import { startOfDay } from 'date-fns';
import { PlayerStatDto } from '@shared/lib/dtos/player/player-stat.dto';
import { Diff, MongooseDocument } from '@shared/lib/utils/types';
import { PlayerRatingDto } from '@shared/lib/dtos/player/player-rating.dto';
import { defaultFuzzyOptions } from '@shared/lib/data/data.constants';
import Fuse from 'fuse.js';
import { similarityTokenize } from '@schema/core/match/similarity';
import { SCHEMA_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { BaseEntityService } from '@schema/core/entity/base-entity.service';
import { PlayerRatingDocument } from '@schema/player/models/player-rating.schema';
import {
	NotEnoughFixturesException,
	NotInSeasonException,
	NotInWeekDayException,
	NotPlayingException,
} from '@shared/lib/exceptions/generate-player-exception';
import { FixtureService } from '@schema/fixture/services/fixture.service';
import { PlayerStat } from '@schema/player/models/player-stat.entity';

@Injectable()
export class PlayerService extends BaseEntityService<Player> {
	constructor(
		@InjectSwRepository(Player) private readonly playerRepository: SwRepository<Player>,
		@InjectSwRepository(PlayerStat) private readonly playerStatRepository: SwRepository<PlayerStat>,
		private readonly fixtureService: FixtureService,
		private readonly userLeaguePreferenceService: UserLeaguePreferenceService,
		@InjectModel('UserPlayers') private readonly userPlayersModel: Model<UserPlayersDocument>,
		@InjectModel('PlayerRating') private readonly playerRatingModel: Model<PlayerRatingDocument>,
		@Inject(SCHEMA_LOGGER) private readonly logger: Logger
	) {
		super(playerRepository);
	}

	async getOwnedPlayerIds({ userId, leagueId, date }) {
		return this.userPlayersModel.findOne({
			userId,
			leagueId,
			week: date,
		});
	}

	async getOrCreatePlayersForUser({ userId, leagueId, date = new Date() }) {
		const season = getSeason(date);
		if (!season) {
			throw new NotInSeasonException('Not in season');
		}
		let userPlayers = await this.getOwnedPlayerIds({ userId, leagueId, date });
		if (!userPlayers) {
			const numFixtures = await this.fixtureService.numMatchesForWeek({ leagueId, date });
			if (!numFixtures) {
				throw new NotPlayingException('League is not in play this week');
			}
			if ([0, 6].includes(new Date().getDay())) {
				throw new NotInWeekDayException('Cant play during the weekends');
			}
			const userPreference = await this.userLeaguePreferenceService.find({ userId, leagueId });
			const formationName = userPreference ? userPreference.formation : '4-4-2';
			const formation = formationMap[formationName];
			const playerIds = await this.generateFormationIds({
				formation,
				leagueId,
				date,
			});

			userPlayers = new this.userPlayersModel({
				userId,
				leagueId,
				week: date,
				formation: formationName,
				season,
				players: playerIds,
			});

			await userPlayers.save();
		}

		return userPlayers;
	}

	async deletePlayersForUser({ leagueId, userId }) {
		return this.userPlayersModel.remove({
			leagueId,
			userId,
		});
	}

	async getPlayerByIds(playerIds, includes: string[] = []) {
		return this.playerRepository.getByIdsOrdered(playerIds, includes);
	}

	async getPlayerStats(playerIds, season = getSeason(new Date())) {
		return this.playerStatRepository.find({
			where: {
				playerId: In(playerIds),
				season,
			},
		});
	}

	async generateFormation({ formation, leagueId, maxPlayers = 15, date = new Date() }) {
		const playerIds = await this.generateFormationIds({
			formation,
			leagueId,
			maxPlayers,
			date,
		});

		return this.playerRepository.getByIdsOrdered(playerIds);
	}

	async generateFormationIds({
		formation,
		leagueId,
		maxPlayers = 15,
		date = new Date(),
	}: {
		formation: FormationDto;
		leagueId: number;
		maxPlayers?: number;
		date?: Date;
	}): Promise<number[]> {
		const queryBuilder = this.playerRepository.createQueryBuilder('player');
		queryBuilder
			.select(['player.id', 'player.rating', 'player.positions'])
			.innerJoin('player.team', 'team')
			.innerJoin(
				'player_stat',
				'player_stat',
				'player_stat.player_id = player.id and player_stat.season = :season',
				{ season: getSeason(new Date()) }
			)
			.where('team.leagueId = :leagueId AND player_stat.chance >= 0.34', { leagueId })
			.andWhere(qb => {
				const subQuery = qb
					.subQuery()
					.select(['fixture.id'])
					.from(Fixture, 'fixture')
					.where(new Brackets(qb => qb.where('team.id = fixture.home_id OR team.id = fixture.away_id')))
					.andWhere(
						"fixture.time <= select_next_interval(:date) AND fixture.time >= NOW() AND fixture.status = 'PENDING' AND fixture.league_id = :leagueId"
					);
				return `EXISTS (${subQuery.getQuery()})`;
			});
		queryBuilder.setParameters({
			date: startOfDay(date),
			leagueId,
		});

		queryBuilder.orderBy('RANDOM()');

		const playerDetails = (await queryBuilder.getRawMany()).map(row => ({
			id: row.player_id,
			rating: row.player_rating,
			positions: row.player_positions,
		}));
		return this.generateRandomXV(formation, playerDetails, maxPlayers);
	}

	async generatePlayersInRange({
		maxRating = 100,
		minRating = 0,
		leagueId,
		numPlayers = 1,
		position,
	}: {
		numPlayers?: number;
		maxRating?: number;
		minRating?: number;
		leagueId: number;
		position?: string;
	}) {
		const queryBuilder = this.playerRepository.createQueryBuilder('player');
		queryBuilder.innerJoinAndSelect('player.team', 'team');
		queryBuilder.where('team.leagueId = :leagueId', { leagueId });
		if (position) {
			queryBuilder.andWhere(':position = ANY(player.positions)', { position });
		}
		queryBuilder.orderBy('RANDOM()');
		const queryBuilderWithoutRatings = queryBuilder.clone();
		queryBuilder.andWhere('player.rating <= :maxRating AND player.rating >= :minRating', {
			maxRating,
			minRating,
		});
		queryBuilder.limit(numPlayers);
		const allPlayers = await queryBuilder.getMany();
		if (allPlayers.length < numPlayers) {
			const maxRatingQueryBuilder = queryBuilderWithoutRatings.clone();
			maxRatingQueryBuilder.andWhere('player.rating <= :maxRating', {
				maxRating,
			});
			maxRatingQueryBuilder.limit(numPlayers - allPlayers.length);
			const players = await queryBuilder.getMany();
			allPlayers.push(...players);
		}
		if (allPlayers.length < numPlayers) {
			const minRatingQueryBuilder = queryBuilderWithoutRatings.clone();
			minRatingQueryBuilder.andWhere('player.rating >= :minRating', {
				minRating,
			});
			minRatingQueryBuilder.limit(numPlayers - allPlayers.length);
			const players = await queryBuilder.getMany();
			allPlayers.push(...players);
		}
		return allPlayers;
	}

	private generateRandomXV(strategy: FormationDto, players, maxPlayers: number) {
		const positionMap: { [key: string]: { players: any[]; range?: [number, number] } } = players.reduce(
			(map, currentPlayer) => {
				for (const position of currentPlayer.positions) {
					if (!map[position]) {
						map[position] = {
							players: [],
						};
					}
					map[position].players.push(currentPlayer);
				}
				return map;
			},
			{}
		);
		for (const position of Object.keys(positionMap)) {
			const ratings = positionMap[position].players.map(player => player.rating);
			positionMap[position].range = [min(ratings), max(ratings)];
		}
		const usedPlayers: any[] = [];
		const extraPositions = ['GK', 'CB', 'CM', 'ST'];
		const requiredPositions = strategy.formation
			.map(position => position.name)
			.concat(range(0, maxPlayers - strategy.formation.length).map(i => extraPositions[i]));

		for (const position of requiredPositions) {
			const availablePlayers: any[] = (positionMap[position] || { players: [] }).players;
			if (!availablePlayers || !availablePlayers.length) {
				throw new NotEnoughFixturesException(
					`Not a valid formation ${strategy.name}. Position not found ${position}`
				);
			}
			const trials = 5;
			for (let i = 0; i < trials; i++) {
				const selectedRange =
					i === trials - 1 ? positionMap[position].range! : randomCfRange(positionMap[position].range!, 5);
				const foundPlayer = availablePlayers.find(
					player => player.rating <= selectedRange[1] && player.rating >= selectedRange[0]
				);
				if (foundPlayer) {
					markPlayerUnavailable(foundPlayer);
					usedPlayers.push(foundPlayer.id);
					break;
				}
			}
		}
		return usedPlayers;

		function markPlayerUnavailable(removedPlayer) {
			for (const position of removedPlayer.positions) {
				positionMap[position].players = positionMap[position].players.filter(
					player => player !== removedPlayer
				);
			}
		}
	}

	async savePlayerStat(playerStat: PlayerStatDto) {
		return this.playerStatRepository.upsert({
			object: playerStat,
			conflictColumns: ['playerId', 'season'],
		});
	}

	savePlayerRating(playerRating: Diff<PlayerRatingDto, MongooseDocument>) {
		return this.playerRatingModel.findOneAndUpdate(
			{
				playerId: playerRating.playerId,
				fixtureId: playerRating.fixtureId,
			},
			playerRating,
			{
				upsert: true,
				new: true,
			}
		);
	}

	getPlayersByTeam(teamId: number) {
		return this.playerRepository.find({
			where: {
				teamId,
			},
		});
	}

	fuzzySearch(
		dbPlayers: Player[],
		searchPlayers: { name: string; shirt: number; team: string }[]
	): (Player | null)[] {
		const playerFuse = new Fuse(dbPlayers, {
			...defaultFuzzyOptions,
			includeScore: true,
			threshold: 0.5,
			keys: ['name', 'alias'],
		});

		return searchPlayers.map(searchPlayer => {
			const matchedResults = playerFuse.search(searchPlayer.name);
			const matchedItem: any = matchedResults && matchedResults[0];
			let matchedPlayer = matchedItem && matchedItem.item;
			if (matchedPlayer && (matchedPlayer.shirt === searchPlayer.shirt || matchedItem.score <= 0.3)) {
				this.logger.trace(`Match ${matchedPlayer.name} with ${searchPlayer.name}`);
				return matchedPlayer;
			} else {
				matchedPlayer = dbPlayers.find(player => player.shirt === searchPlayer.shirt);
				if (matchedPlayer) {
					const similarityScore = similarityTokenize(matchedPlayer.name, searchPlayer.name);
					if (similarityScore <= 0.75) {
						this.logger.warn(`Match ${matchedPlayer.name} with ${searchPlayer.name} by shirt`);
						return matchedPlayer;
					} else {
						this.logger.warn(
							`${searchPlayer.team} Not able to find ${searchPlayer.name}. Tried ${matchedPlayer.name} (${similarityScore})`
						);
					}
				} else {
					this.logger.warn(`${searchPlayer.team} Not able to find ${searchPlayer.name}.`);
				}
			}
		});
	}
}
