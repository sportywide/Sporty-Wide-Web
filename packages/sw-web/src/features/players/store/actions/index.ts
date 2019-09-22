import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import {
	ADD_PLAYERS,
	LOAD_PLAYER_SUCCESS,
	LOAD_PLAYERS,
	REMOVE_PLAYERS,
	RESET_PLAYERS,
	SET_PLAYERS,
} from '@web/features/players/store/actions/actions.constants';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';

export const loadPlayers = createSwStandardAction(LOAD_PLAYERS)();
export const addPlayersToList = createSwStandardAction(ADD_PLAYERS)<PlayerDto[]>();
export const removePlayersFromList = createSwStandardAction(REMOVE_PLAYERS)<PlayerDto[]>();
export const loadPlayersSuccess = createSwStandardAction(LOAD_PLAYER_SUCCESS)<PlayerDto[]>();
export const setPlayers = createSwStandardAction(SET_PLAYERS)<PlayerDto[]>();
export const resetPlayers = createSwStandardAction(RESET_PLAYERS)();
