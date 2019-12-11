import { Injectable } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { BaseEntityService } from '@schema/core/entity/base-entity.service';
import { Fixture } from '@schema/fixture/models/fixture.entity';
import { startOfWeek, startOfDay, addWeeks, format, addDays } from 'date-fns';
import { Between } from 'typeorm';

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

	findMatchesForDay({ leagueId, date }) {
		date = startOfDay(date);
		const today = format(date, 'yyyy-MM-dd');
		const tomorrow = format(addDays(date, 1), 'yyyy-MM-dd');
		return this.fixtureRepository.find({
			where: {
				leagueId,
				time: Between(today, tomorrow),
			},
		});
	}
}
