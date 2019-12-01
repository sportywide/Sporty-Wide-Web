import * as actions from '@web/features/leagues/base/store/actions';
import { ActionType, createReducer } from 'typesafe-actions';
import { LeagueStandingsDto } from '@shared/lib/dtos/leagues/league-standings.dto';

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
