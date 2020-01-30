import { Injectable } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { BaseEntityService } from '@schema/core/entity/base-entity.service';
import { Team } from '@schema/team/models/team.entity';
import { defaultFuzzyOptions } from '@shared/lib/data/data.constants';
import Fuse from 'fuse.js';
import { TeamListFilteredDto } from '@shared/lib/dtos/team/team-list-filtered.dto';
import { ArgsType, Field } from '@shared/lib/utils/api/graphql';
import { defaultPagination, PaginationArgs } from '@shared/lib/utils/api/graphql/pagination.args';

@ArgsType()
export class TeamFilteredInput extends PaginationArgs {
	@Field(() => TeamListFilteredDto, { nullable: true })
	filter?: TeamListFilteredDto;
}

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

	async filteredList(filteredList: TeamFilteredInput) {
		filteredList = { ...defaultPagination, ...(filteredList || {}) };
		const queryBuilder = this.repository.createQueryBuilder();
		queryBuilder.offset(filteredList.skip);
		queryBuilder.limit(filteredList.limit);
		queryBuilder.orderBy('id');
		if (filteredList.filter?.leagueId && filteredList.filter?.leagueId.length) {
			queryBuilder.addWhere('league_id IN (:...leagueId)', {
				leagueId: filteredList.filter?.leagueId,
			});
		}
		if (filteredList.filter?.search) {
			queryBuilder.addWhere('(LOWER(title) LIKE :search OR LOWER(league) LIKE :search)', {
				search: `%${filteredList.filter?.search.toLowerCase()}%`,
			});
		}
		const [items, count] = await Promise.all([queryBuilder.getMany(), queryBuilder.getCount()]);
		return {
			items,
			count,
		};
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
