import * as actions from '@web/features/lineup/store/actions';
import { ActionType, createReducer } from 'typesafe-actions';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import strategy from '@shared/lib/strategy/4-4-2.json';
import { fill } from 'lodash';
import { FormationDto } from '@shared/lib/dtos/formation/formation.dto';

export const NUM_PLAYERS = 11;

export interface ILineupState {
	strategy: FormationDto;
	positions: (PlayerDto | null)[];
}

export type LineupAction = ActionType<typeof actions>;

const initialState: ILineupState = {
	positions: fill(Array(NUM_PLAYERS), null),
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
			positions: state.positions.map((player, index) => {
				if (index === payload.index) {
					return null;
				}
				return player;
			}),
		};
	})
	.handleAction(actions.changeStrategy, (state, { payload }) => {
		return {
			...state,
			strategy: payload,
		};
	});
