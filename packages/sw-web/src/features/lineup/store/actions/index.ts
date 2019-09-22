import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import {
	ADD_PLAYER_TO_LINEUP,
	CHANGE_STRATEGY,
	FILL_POSITIONS,
	FILL_POSITION_SUCCESS,
	REMOVE_PLAYER_FROM_LINEUP,
	SWAP_PLAYERS,
	SWITCH_LINEUP_POSITION,
	SUBSTITUTE_PLAYER,
	CLEAR_POSITION, CLEAR_LINEUP,
} from '@web/features/lineup/store/actions/actions.constants';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { FormationDto } from '@shared/lib/dtos/formation/formation.dto';

export const swapPlayers = createSwStandardAction(SWAP_PLAYERS)<{ first: PlayerDto; second: PlayerDto }>();
export const substitutePlayer = createSwStandardAction(SUBSTITUTE_PLAYER)<{
	first: PlayerDto;
	second: PlayerDto;
}>();
export const clearLineupPosition = createSwStandardAction(CLEAR_POSITION)<number>();
export const removePlayerFromLineup = createSwStandardAction(REMOVE_PLAYER_FROM_LINEUP)<PlayerDto>();
export const changeStrategy = createSwStandardAction(CHANGE_STRATEGY)<FormationDto>();
export const addPlayerToLineup = createSwStandardAction(ADD_PLAYER_TO_LINEUP)<{ player: PlayerDto; index: number }>();
export const switchLineupPositions = createSwStandardAction(SWITCH_LINEUP_POSITION)<{
	player: PlayerDto;
	index: number;
}>();
export const fillPositions = createSwStandardAction(FILL_POSITIONS)();
export const clearLineup = createSwStandardAction(CLEAR_LINEUP)();
export const fillPositionSuccess = createSwStandardAction(FILL_POSITION_SUCCESS)<PlayerDto[]>();
