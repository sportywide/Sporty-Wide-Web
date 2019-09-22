import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import {
	ADD_PLAYER_TO_LINEUP,
	CHANGE_STRATEGY,
	CLEAR_LINEUP_POSITION,
	FILL_POSITIONS,
	FILL_POSITION_SUCCESS,
	REMOVE_PLAYER_FROM_LINEUP,
	SWAP_PLAYERS,
} from '@web/features/lineup/store/actions/actions.constants';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { FormationDto } from '@shared/lib/dtos/formation/formation.dto';

export const swapPlayers = createSwStandardAction(SWAP_PLAYERS)<{ first: PlayerDto; second: PlayerDto }>();
export const removePlayerFromLineup = createSwStandardAction(REMOVE_PLAYER_FROM_LINEUP)<{
	removedPlayer: PlayerDto;
	index: number;
}>();
export const changeStrategy = createSwStandardAction(CHANGE_STRATEGY)<FormationDto>();
export const addPlayerToLineup = createSwStandardAction(ADD_PLAYER_TO_LINEUP)<{ player: PlayerDto; index: number }>();
export const clearLineupPosition = createSwStandardAction(CLEAR_LINEUP_POSITION)<number>();
export const fillPositions = createSwStandardAction(FILL_POSITIONS)();
export const fillPositionSuccess = createSwStandardAction(FILL_POSITION_SUCCESS)<PlayerDto[]>();
