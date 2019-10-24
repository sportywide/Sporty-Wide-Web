import { Injectable } from '@nestjs/common';
import { Player } from '@schema/player/models/player.entity';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';

@Injectable()
export class PlayerService {
	constructor(@InjectSwRepository(Player) private readonly playerRepository: SwRepository<Player>) {}

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
		queryBuilder.innerJoin('player.team', 'team');
		queryBuilder.where('team.leagueId = :leagueId', { leagueId });
		if (position) {
			queryBuilder.andWhere(':position = ANY(player.positions)', { position });
		}
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
}
