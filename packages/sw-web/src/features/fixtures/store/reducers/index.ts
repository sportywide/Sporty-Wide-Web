import { ActionType } from 'typesafe-actions';
import * as actions from '@web/features/fixtures/store/actions';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';
import { createReducer } from '@web/shared/lib/redux/action-creators';

interface IState {
	upcoming: {
		[key: number]: FixtureDto;
	};
	weekly: {
		[key: number]: FixtureDto;
	};
}

export type FixtureActions = ActionType<typeof actions>;

const initialState = {
	upcoming: {},
	weekly: {},
};

const upcomingReducer = createReducer<IState, FixtureActions>(initialState).handleAction(
	actions.fetchWeeklyFixturesForTeamsSuccess,
	(state, { payload: weeklyFixtures = {} }) => ({
		...state,
		weekly: {
			...state.weekly,
			...weeklyFixtures,
		},
	})
);

const weeklyReducer = createReducer<IState, FixtureActions>(initialState).handleAction(
	actions.fetchUpcomingFixturesForTeamsSuccess,
	(state, { payload: upcomingFixtures = {} }) => ({
		...state,
		upcoming: {
			...state.upcoming,
			...upcomingFixtures,
		},
	})
);

export const fixtureReducer = createReducer<IState, FixtureActions>(initialState, {
	...weeklyReducer.handlers,
	...upcomingReducer.handlers,
});
