import { Injectable } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { BaseEntityService } from '@api/core/services/entity/base-entity.service';
import { Fixture } from '@schema/fixture/models/fixture.entity';
import { startOfWeek, startOfDay, addWeeks } from 'date-fns';

@Injectable()
export class FixtureService extends BaseEntityService<Fixture> {
	constructor(@InjectSwRepository(Fixture) private readonly fixtureRepository: SwRepository<Fixture>) {
		super(fixtureRepository);
	}

	findMatchesForWeek({ leagueId, date = new Date() }) {
		const thisMonday = startOfDay(startOfWeek(date, { weekStartsOn: 1 }));
		const nextMonday = addWeeks(thisMonday, 1);
		const queryBuilder = this.fixtureRepository
			.createQueryBuilder()
			.where('time >= :start AND time < :end AND league_id = :leagueId');
		queryBuilder.setParameters({
			start: thisMonday,
			end: nextMonday,
			leagueId,
		});
		return queryBuilder.getMany();
	}

	findMatchesForLeague({ leagueId, season }) {
		return this.fixtureRepository.find({
			where: {
				leagueId,
				season,
			},
		});
	}
}
