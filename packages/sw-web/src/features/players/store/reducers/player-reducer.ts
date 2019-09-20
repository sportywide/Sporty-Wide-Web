import * as actions from '@web/features/players/store/actions';
import { ActionType, createReducer } from 'typesafe-actions';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';

export interface IPlayerState {
	players: PlayerDto[];
}

export type PlayerActions = ActionType<typeof actions>;

const initialState: IPlayerState = {
	players: [],
};

export const playerReducer = createReducer<IPlayerState, PlayerActions>(initialState).handleAction(
	actions.loadPlayersSuccess,
	(state, { payload = [] }) => ({ ...state, players: payload })
);
