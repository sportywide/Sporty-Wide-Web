import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from '@web/features/players/store/actions';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';

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
		(state, { payload: { userId, leagueId, players, formation, preference } }) => ({
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
	.handleAction(actions.fetchMyPlayersError, (state, { payload: { userId, leagueId, errorCode, errorMessage } }) => ({
		...state,
		[userId]: {
			...(state[userId] || {}),
			[leagueId]: {
				loading: false,
				errorCode,
				errorMessage,
			},
		},
	}))
	.handleAction(actions.fetchMyPlayers, (state, { payload: { userId, leagueId } }) => ({
		...state,
		[userId]: {
			...(state[userId] || {}),
			[leagueId]: {
				loading: true,
				players: [],
			},
		},
	}));
