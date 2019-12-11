import { Injectable } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { BaseEntityService } from '@schema/core/entity/base-entity.service';
import { Team } from '@schema/team/models/team.entity';
import { defaultFuzzyOptions } from '@shared/lib/data/data.constants';
import Fuse from 'fuse.js';

@Injectable()
export class TeamService extends BaseEntityService<Team> {
	constructor(@InjectSwRepository(Team) private readonly teamRepository: SwRepository<Team>) {
		super(teamRepository);
	}

	findByLeague(leagueId) {
		return this.teamRepository.find({
			where: {
				leagueId,
			},
		});
	}

	fuzzySearch<T>(teams: T[], teamName): T | null {
		const options = [
			{
				...defaultFuzzyOptions,
				keys: ['title', 'alias'],
			},
			{
				...defaultFuzzyOptions,
				tokenize: true,
				threshold: 0.3,
				keys: ['title', 'alias'],
			},
		];
		for (const option of options) {
			const fuse = new Fuse(teams, option);
			const searchResult = fuse.search(teamName);
			const matchedItem = searchResult && searchResult[0];
			if (matchedItem) {
				return matchedItem;
			}
		}
		return null;
	}
}
