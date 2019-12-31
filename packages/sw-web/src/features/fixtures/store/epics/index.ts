import { createStandardEpic } from '@web/shared/lib/redux/epic';
import { FETCH_UPCOMING_FIXTURES } from '@web/features/fixtures/store/actions/actions.constants';
import { FixtureService } from '@web/features/fixtures/services/fixture.service';
import { fetchUpcomingFixturesSuccess } from '@web/features/fixtures/store/actions';

export const fetchUpcomingFixturesEpic = createStandardEpic<number[], any>({
	actionType: FETCH_UPCOMING_FIXTURES,
	effect: ({ payload: teamIds }, container) => {
		const fixtureService = container.get(FixtureService);
		return fixtureService.fetchUpcomingFixtures(teamIds);
	},
	successAction: (action, result) => fetchUpcomingFixturesSuccess(result),
});
