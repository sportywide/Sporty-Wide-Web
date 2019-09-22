import * as actions from '@web/features/players/store/actions';
import { ActionType, createReducer, getType, PayloadAction } from 'typesafe-actions';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';

export interface IPlayerState {
	players: PlayerDto[];
}

export type PlayerActions = ActionType<typeof actions>;

const initialState: IPlayerState = {
	players: [],
};

export const playerReducer = createReducer<IPlayerState, PlayerActions>(initialState)
	.handleAction(actions.addPlayersToList, (state, { payload }: PayloadAction<string, PlayerDto[]>) => {
		return {
			...state,
			players: sortPlayers([...state.players, ...payload]),
		};
	})
	.handleAction(actions.removePlayersFromList, (state, { payload }: PayloadAction<string, PlayerDto[]>) => {
		return {
			...state,
			players: sortPlayers(state.players.filter(player => !payload.includes(player))),
		};
	})
	.handleAction([actions.loadPlayersSuccess], (state, { payload = [] }: PayloadAction<string, PlayerDto[]>) => ({
		...state,
		players: payload,
	}));

const ordering = {
	GK: 1,
	LB: 2,
	CB: 3,
	RB: 3,
	DM: 4,
	CM: 5,
	LM: 6,
	RM: 7,
	AM: 8,
	LF: 9,
	ST: 10,
	CF: 10,
	SS: 11,
	RF: 12,
};
export function sortPlayers(players) {
	return players.sort((a: PlayerDto, b: PlayerDto) => {
		const aPosition = ordering[a.positions[0]];
		const bPosition = ordering[b.positions[0]];
		if (aPosition === bPosition) {
			return b.rating - a.rating;
		}
		return aPosition - bPosition;
	});
}
