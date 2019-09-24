import * as actions from '@web/features/lineup/store/actions';
import { ActionType, createReducer, PayloadAction } from 'typesafe-actions';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import strategy from '@shared/lib/strategy/4-3-3.json';
import { fill } from 'lodash';
import { FormationDto } from '@shared/lib/dtos/formation/formation.dto';

export const NUM_PLAYERS = 11;

export interface ILineupState {
	strategy: FormationDto;
	positions: (PlayerDto | null)[];
}

export type LineupAction = ActionType<typeof actions>;

const EMPTY_LINEUP = fill(Array(NUM_PLAYERS), null);
const initialState: ILineupState = {
	positions: EMPTY_LINEUP,
	strategy,
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
	.handleAction(actions.fillPositionSuccess, (state, { payload }) => {
		return {
			...state,
			positions: payload,
		};
	})
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
	.handleAction(actions.removePlayerFromLineup, (state, { payload }) => {
		return {
			...state,
			positions: state.positions.map(player => {
				if (player === payload) {
					return null;
				}
				return player;
			}),
		};
	})
	.handleAction(actions.changeStrategySuccess, (state, { payload }) => {
		return {
			...state,
			strategy: payload,
			positions: EMPTY_LINEUP,
		};
	})
	.handleAction(actions.clearLineup, state => {
		return {
			...state,
			positions: EMPTY_LINEUP,
		};
	});
