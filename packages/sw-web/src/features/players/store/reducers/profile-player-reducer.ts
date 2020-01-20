import { ActionType } from 'typesafe-actions';
import * as actions from '@web/features/players/store/actions';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { createReducer } from '@web/shared/lib/redux/action-creators';

export type ProfilePlayersAction = ActionType<typeof actions>;

export interface IProfilePlayers {
	players: PlayerDto[];
	loading: boolean;
	formation: string;
	preference: any;
	errorCode?: string;
	errorMessage?: string;
}

interface IState {
	playerMap: any;
	loading: boolean;
}

const initialState = {
	playerMap: {},
	loading: false,
};

export const profilePlayersReducer = createReducer<IState, ProfilePlayersAction>(initialState)
	.handleAction(
		actions.fetchMyPlayersSuccess,
		(
			state,
			{
				payload: { leagueId, players, formation, preference },
				meta: {
					user: { id: userId },
				},
			}
		) => ({
			...state,
			[userId]: {
				...(state[userId] || {}),
				[leagueId]: {
					loading: false,
					formation,
					players,
					preference,
				},
			},
		})
	)
	.handleAction(
		actions.fetchMyPlayersError,
		(
			state,
			{
				payload: { leagueId, errorCode, errorMessage },
				meta: {
					user: { id: userId },
				},
			}
		) => ({
			...state,
			[userId]: {
				...(state[userId] || {}),
				[leagueId]: {
					loading: false,
					errorCode,
					errorMessage,
				},
			},
		})
	)
	.handleAction(actions.fetchMyPlayers, (state, { payload: { leagueId }, meta: { user: { id: userId } } }) => ({
		...state,
		[userId]: {
			...(state[userId] || {}),
			[leagueId]: {
				loading: true,
				players: [],
			},
		},
	}));
