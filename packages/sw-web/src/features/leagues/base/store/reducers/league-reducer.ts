import * as actions from '@web/features/leagues/base/store/actions';
import { ActionType, createReducer } from 'typesafe-actions';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';

export type LeagueActions = ActionType<typeof actions>;

const initialState: LeagueDto[] = null;

export const leagueReducer = createReducer<LeagueDto[], LeagueActions>(initialState).handleAction(
	actions.fetchLeaguesSuccess,
	(state, { payload: leagues }) => {
		return leagues;
	}
);
