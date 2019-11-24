import * as actions from '@web/features/lineup/store/actions';
import { ActionType, createReducer, PayloadAction } from 'typesafe-actions';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import strategy from '@shared/lib/strategy/4-4-2.json';
import { fill } from 'lodash';
import { FormationDto } from '@shared/lib/dtos/formation/formation.dto';
import { NUM_PLAYERS, sortPlayers } from '@web/features/players/utility/player';

export interface ILineupState {
	strategy: FormationDto;
	positions: (PlayerDto | null)[];
	players: PlayerDto[];
	originalPlayers: PlayerDto[];
	formation: string;
}

export type LineupAction = ActionType<typeof actions>;

const EMPTY_LINEUP = fill(Array(NUM_PLAYERS), null);
const initialState: ILineupState = {
	positions: EMPTY_LINEUP,
	strategy,
	players: undefined,
	originalPlayers: undefined,
	formation: undefined,
};

export const lineupReducer = createReducer<ILineupState, LineupAction>(initialState)
	.handleAction(actions.addPlayerToLineup, (state, { payload }) => {
		return {
			...state,
			positions: [
				...state.positions.slice(0, payload.index),
				payload.player,
				...state.positions.slice(payload.index + 1),
			],
			players: state.players.filter(player => payload.player !== player),
		};
	})
	.handleAction(actions.clearLineupPosition, (state, { payload }) => {
		return {
			...state,
			positions: [...state.positions.slice(0, payload), null, ...state.positions.slice(payload + 1)],
		};
	})
	.handleAction(
		actions.switchLineupPositions,
		(state, { payload }: PayloadAction<string, { player: PlayerDto; index: number }>) => {
			const player = payload.player;
			const currentIndex = state.positions.findIndex(position => position === player);
			if (currentIndex < 0) {
				return state;
			}
			const newPositions = [...state.positions];
			newPositions[currentIndex] = null;
			newPositions[payload.index] = player;
			return {
				...state,
				positions: newPositions,
			};
		}
	)
	.handleAction(
		actions.fetchPlayersSuccess,
		(state, { payload: { players = [], formation = '4-4-2' } }: PayloadAction<string, any>) => ({
			...state,
			players: players,
			originalPlayers: players,
			formation,
		})
	)
	.handleAction(
		actions.fillPositionSuccess,
		(state, { payload: filledPositions = [] }: PayloadAction<string, PlayerDto[]>) => {
			return {
				...state,
				positions: filledPositions,
				players: state.players.filter(player => !filledPositions.includes(player)),
			};
		}
	)
	.handleAction(actions.swapPlayers, (state, { payload }) => {
		const positions = state.positions;
		const sourceIndex = positions.findIndex(position => position && position.id === payload.first.id);
		const destinationIndex = positions.findIndex(position => position && position.id === payload.second.id);
		if (!(sourceIndex >= 0 && destinationIndex >= 0)) {
			return state;
		}
		const newLineup = [...positions];
		newLineup[sourceIndex] = payload.second;
		newLineup[destinationIndex] = payload.first;
		return {
			...state,
			positions: newLineup,
		};
	})
	.handleAction(actions.removePlayerFromLineup, (state, { payload: removedPlayer }) => {
		return {
			...state,
			positions: state.positions.map(player => {
				if (player === removedPlayer) {
					return null;
				}
				return player;
			}),
			players: sortPlayers(state.players.concat(removedPlayer)),
		};
	})
	.handleAction(actions.changeStrategySuccess, (state, { payload }) => {
		return {
			...state,
			strategy: payload,
			positions: EMPTY_LINEUP,
			players: state.originalPlayers || [],
		};
	})
	.handleAction(actions.clearLineup, state => {
		return {
			...state,
			positions: EMPTY_LINEUP,
			players: state.originalPlayers || [],
		};
	});
