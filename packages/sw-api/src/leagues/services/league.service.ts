import { Injectable } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { League } from '@schema/league/models/league.entity';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { BaseEntityService } from '@api/core/services/entity/base-entity.service';
import { UserLeague } from '@schema/league/models/user-league.entity';

@Injectable()
export class LeagueService extends BaseEntityService<League> {
	constructor(
		@InjectSwRepository(League) private readonly leagueRepository: SwRepository<League>,
		@InjectSwRepository(UserLeague) private readonly userLeagueRepository: SwRepository<UserLeague>
	) {
		super(leagueRepository);
	}

	findAll() {
		return this.leagueRepository.find();
	}

	findUserLeagues(userId) {
		return this.userLeagueRepository.find({
			where: {
				userId,
			},
			relations: ['league'],
		});
	}

	leaveLeague(userId, leagueId) {
		return this.userLeagueRepository.delete({
			userId,
			leagueId,
		});
	}

	async joinLeague(userId, leagueId) {
		const userLeague = await this.userLeagueRepository.findOne({
			where: {
				userId,
				leagueId,
			},
		});
		if (userLeague) {
			return userLeague;
		}
		return this.userLeagueRepository.insert({
			userId,
			leagueId,
		});
	}
}
