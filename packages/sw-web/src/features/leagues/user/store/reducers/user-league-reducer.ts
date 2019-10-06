import * as actions from '@web/features/leagues/user/store/actions';
import { ActionType, createReducer } from 'typesafe-actions';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';

export interface ILeagueState {
	[key: number]: LeagueDto[];
}

export type UserLeagueActions = ActionType<typeof actions>;

const initialState: ILeagueState = {};

export const userLeagueReducer = createReducer<ILeagueState, UserLeagueActions>(initialState).handleAction(
	actions.fetchUserLeaguesSuccess,
	(state, { payload: { leagues, userId } }) => {
		return {
			...state,
			[userId]: leagues,
		};
	}
);
