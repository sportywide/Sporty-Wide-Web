import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from '@web/features/profile/players/store/actions';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';

export type ProfilePlayersAction = ActionType<typeof actions>;

export interface IProfilePlayers {
	players: PlayerDto[];
	loading: boolean;
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
	.handleAction(actions.fetchProfilePlayersSuccess, (state, { payload: { userId, leagueId, players } }) => ({
		...state,
		[userId]: {
			...(state[userId] || {}),
			[leagueId]: {
				loading: false,
				players,
			},
		},
	}))
	.handleAction(actions.fetchProfilePlayers, (state, { payload: { userId, leagueId } }) => ({
		...state,
		[userId]: {
			...(state[userId] || {}),
			[leagueId]: {
				loading: true,
				players: [],
			},
		},
	}));
