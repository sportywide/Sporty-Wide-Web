import { createStandardEpic } from '@web/shared/lib/redux/epic';
import {
	FETCH_UPCOMING_FIXTURES_FOR_TEAMS,
	FETCH_WEEKLY_FIXTURES_FOR_TEAMS,
} from '@web/features/fixtures/store/actions/actions.constants';
import { FixtureService } from '@web/features/fixtures/services/fixture.service';
import {
	fetchUpcomingFixturesForTeamsSuccess,
	fetchWeeklyFixturesForTeamsSuccess,
} from '@web/features/fixtures/store/actions';

export const fetchUpcomingFixturesForTeamsEpic = createStandardEpic<number[], any>({
	actionType: FETCH_UPCOMING_FIXTURES_FOR_TEAMS,
	effect: ({ payload: teamIds }, container) => {
		const fixtureService = container.get(FixtureService);
		return fixtureService.fetchUpcomingFixturesForTeams(teamIds);
	},
	successAction: (action, result) => fetchUpcomingFixturesForTeamsSuccess(result),
});

export const fetchWeeklyFixtureForTeamsEpic = createStandardEpic<number[], any>({
	actionType: FETCH_WEEKLY_FIXTURES_FOR_TEAMS,
	effect: ({ payload: teamIds }, container) => {
		const fixtureService = container.get(FixtureService);
		return fixtureService.fetchWeeklyFixturesForTeams(teamIds);
	},
	successAction: (action, result) => fetchWeeklyFixturesForTeamsSuccess(result),
});
