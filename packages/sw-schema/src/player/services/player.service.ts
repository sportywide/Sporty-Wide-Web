import { FormationDto, formationMap } from '@shared/lib/dtos/formation/formation.dto';
import { randomCfRange } from '@shared/lib/utils/random/probability';
import { range } from '@shared/lib/utils/array/range';
import { Injectable } from '@nestjs/common';
import { Player } from '@schema/player/models/player.entity';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { Fixture } from '@schema/fixture/models/fixture.entity';
import { Brackets } from 'typeorm';
import { max, min } from 'lodash';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserPlayers } from '@schema/player/models/user-players.schema';
import { getSeason } from '@shared/lib/utils/season';
import { UserLeaguePreferenceService } from '@schema/league/services/user-league-preference.service';
import { startOfDay, startOfWeek } from 'date-fns';

@Injectable()
export class PlayerService {
	constructor(
		@InjectSwRepository(Player) private readonly playerRepository: SwRepository<Player>,
		private readonly userLeaguePreferenceService: UserLeaguePreferenceService,
		@InjectModel('UserPlayers') private readonly userPlayersModel: Model<UserPlayers>
	) {}

	async getPlayersForUser({ userId, leagueId, date = new Date() }) {
		const season = getSeason(date);
		if (!season) {
			return null;
		}
		let userPlayers = await this.userPlayersModel.findOne({
			userId,
			leagueId,
			week: date,
		});
		if (!userPlayers) {
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
				season: getSeason(date),
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
			.where('team.leagueId = :leagueId AND player.rating >= 65', { leagueId })
			.andWhere(qb => {
				const subQuery = qb
					.subQuery()
					.select(['fixture.id'])
					.from(Fixture, 'fixture')
					.where(
						new Brackets(() => {
							return 'team.id = fixture.home_id OR team.id = fixture.away_id';
						})
					)
					.andWhere("fixture.time <= select_next_interval(:date) AND fixture.status = 'PENDING'");
				return `EXISTS (${subQuery.getQuery()})`;
			});
		queryBuilder.setParameters({
			date: startOfDay(date),
		});
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
				throw new Error(`Not a valid formation ${strategy.name}. Position not found ${position}`);
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
}
