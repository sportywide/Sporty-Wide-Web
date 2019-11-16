import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from '@web/features/profile/players/store/actions';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';

export type ProfilePlayersAction = ActionType<typeof actions>;

export interface IProfilePlayers {
	players: PlayerDto[];
	loading: boolean;
}

export const profilePlayersReducer = createReducer<IProfilePlayers, ProfilePlayersAction>({
	players: [] as PlayerDto[],
	loading: false,
})
	.handleAction(actions.fetchProfilePlayers, (state, action) => ({
		...state,
		loading: true,
	}))
	.handleAction(actions.fetchProfilePlayersSuccess, (state, action) => ({
		...state,
		players: action.payload,
		loading: false
	}));
