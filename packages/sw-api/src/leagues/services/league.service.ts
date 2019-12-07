import { Injectable } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { League } from '@schema/league/models/league.entity';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { BaseEntityService } from '@api/core/services/entity/base-entity.service';
import { UserLeague } from '@schema/league/models/user-league.entity';
import { UserLeaguePreferenceService } from '@schema/league/services/user-league-preference.service';
import { LeagueResultService } from '@schema/league/services/league-result.service';
import { PlayerService } from '@schema/player/services/player.service';

@Injectable()
export class LeagueService extends BaseEntityService<League> {
	constructor(
		@InjectSwRepository(League) private readonly leagueRepository: SwRepository<League>,
		@InjectSwRepository(UserLeague) private readonly userLeagueRepository: SwRepository<UserLeague>,
		private readonly userLeaguePreferenceService: UserLeaguePreferenceService,
		private readonly playerService: PlayerService,
		private readonly leagueResultService: LeagueResultService
	) {
		super(leagueRepository);
	}

	findAll() {
		return this.leagueRepository.find();
	}

	findLeague(id) {
		return this.leagueRepository.findOne({
			id,
		});
	}

	findUserLeagues(userId) {
		return this.userLeagueRepository.find({
			where: {
				userId,
			},
			relations: ['league'],
		});
	}

	async leaveLeague(userId, leagueId) {
		await this.userLeagueRepository.delete({
			userId,
			leagueId,
		});
		await this.playerService.deletePlayersForUser({ leagueId, userId });
	}

	async joinLeague({ userId, leagueId, formation }) {
		const userLeague = await this.userLeagueRepository.findOne({
			where: {
				userId,
				leagueId,
			},
		});
		if (userLeague) {
			return userLeague;
		}
		await this.userLeagueRepository.insert({
			userId,
			leagueId,
		});

		await this.userLeaguePreferenceService.save({
			userId,
			leagueId,
			formation,
		});
	}

	async setPreferredFormation({ userId, leagueId, formation }) {
		return this.userLeaguePreferenceService.save({
			userId,
			leagueId,
			formation,
		});
	}

	async getUserLeaguePreference({ userId, leagueId }) {
		let preference = await this.userLeaguePreferenceService.find({
			userId,
			leagueId,
		});
		if (!preference) {
			preference = await this.userLeaguePreferenceService.save({
				leagueId,
				userId,
				formation: '4-4-2',
			});
		}
		return preference;
	}

	findLeagueStanding(leagueId: number, season: string) {
		return this.leagueResultService.find({ leagueId, season });
	}
}
