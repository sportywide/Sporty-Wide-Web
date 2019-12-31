import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from '@web/features/fixtures/store/actions';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';

interface IState {
	upcoming: {
		[key: number]: FixtureDto;
	};
}
const initialState = {
	upcoming: {},
};
export type FixtureActions = ActionType<typeof actions>;
export const fixtureReducer = createReducer<IState, FixtureActions>(initialState).handleAction(
	actions.fetchUpcomingFixturesSuccess,
	(state, { payload: upcomingFixtures = {} }) => ({
		...state,
		upcoming: {
			...state.upcoming,
			...upcomingFixtures,
		},
	})
);
