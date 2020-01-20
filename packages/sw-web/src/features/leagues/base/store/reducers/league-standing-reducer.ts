import * as actions from '@web/features/leagues/base/store/actions';
import { ActionType } from 'typesafe-actions';
import { LeagueStandingsDto } from '@shared/lib/dtos/leagues/league-standings.dto';
import { createReducer } from '@web/shared/lib/redux/action-creators';

export type LeagueActions = ActionType<typeof actions>;

const initialState: any = {};

export const leagueStandingReducer = createReducer<Record<number, LeagueStandingsDto>, LeagueActions>(
	initialState
).handleAction(actions.fetchLeagueStandingsSuccess, (state, { payload: { leagueStandings, leagueId } }) => {
	return {
		...state,
		[leagueId]: leagueStandings,
	};
});
