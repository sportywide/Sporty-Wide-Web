import { fetchLeagues, fetchLeaguesSuccess } from '@web/features/leagues/base/store/actions';
import { createTestScheduler, newContainer } from '@web-test/test-setup';
import { LeagueService } from '@web/features/leagues/base/services/league.service';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { ActionsObservable } from 'redux-observable';
import { fetchLeaguesEpic } from '@web/features/leagues/base/store/epics/index';
import { of } from 'rxjs';

describe('Testing fetchLeaguesEpic', () => {
	test('it should submit a redux action with the given leagues', () => {
		const marbles1 = '-a--a--';
		const marbles2 = '-b--b--';

		const container = newContainer();
		const expectedLeagues: LeagueDto[] = [{ id: 1, name: 'premier-league', title: 'Premier League', image: 'abc' }];
		container.set(LeagueService, {
			fetchLeagues: jest.fn().mockReturnValue(of(expectedLeagues)),
		});
		const values = {
			a: fetchLeagues(),
			b: fetchLeaguesSuccess(expectedLeagues),
		};

		const ts = createTestScheduler();

		const source = ActionsObservable.from(ts.createColdObservable(marbles1, values));
		const actual = fetchLeaguesEpic(source, null, {
			container,
		});
		ts.expectObservable(actual).toBe(marbles2, values);
		ts.flush();
	});
});
