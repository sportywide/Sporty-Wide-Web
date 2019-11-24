import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import {
	ADD_PLAYER_TO_LINEUP,
	CHANGE_STRATEGY,
	CHANGE_STRATEGY_SUCCESS,
	CLEAR_LINEUP,
	CLEAR_POSITION,
	FETCH_PLAYER_SUCCESS,
	FETCH_PLAYERS,
	FILL_POSITION_SUCCESS,
	FILL_POSITIONS,
	REMOVE_PLAYER_FROM_LINEUP,
	SUBSTITUTE_PLAYERS,
	SWAP_PLAYERS,
	SWITCH_LINEUP_POSITION,
} from '@web/features/lineup/store/actions/actions.constants';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { FormationDto } from '@shared/lib/dtos/formation/formation.dto';

export const swapPlayers = createSwStandardAction(SWAP_PLAYERS)<{ first: PlayerDto; second: PlayerDto }>();
export const substitutePlayers = createSwStandardAction(SUBSTITUTE_PLAYERS)<{
	first: PlayerDto;
	second: PlayerDto;
}>();
export const clearLineupPosition = createSwStandardAction(CLEAR_POSITION)<number>();
export const removePlayerFromLineup = createSwStandardAction(REMOVE_PLAYER_FROM_LINEUP)<PlayerDto>();
export const changeStrategySuccess = createSwStandardAction(CHANGE_STRATEGY_SUCCESS)<FormationDto>();
export const changeStrategy = createSwStandardAction(CHANGE_STRATEGY)<string>();
export const addPlayerToLineup = createSwStandardAction(ADD_PLAYER_TO_LINEUP)<{ player: PlayerDto; index: number }>();
export const switchLineupPositions = createSwStandardAction(SWITCH_LINEUP_POSITION)<{
	player: PlayerDto;
	index: number;
}>();
export const fillPositions = createSwStandardAction(FILL_POSITIONS)();
export const clearLineup = createSwStandardAction(CLEAR_LINEUP)();
export const fillPositionSuccess = createSwStandardAction(FILL_POSITION_SUCCESS)<PlayerDto[]>();

export const fetchPlayersSuccess = createSwStandardAction(FETCH_PLAYER_SUCCESS)<PlayerDto[]>();
export const fetchPlayers = createSwStandardAction(FETCH_PLAYERS)<number>();
