import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { FETCH_MY_PLAYERS, FETCH_MY_PLAYERS_ERROR, FETCH_MY_PLAYERS_SUCCESS } from './actions.constants';

export const fetchMyPlayers = createSwStandardAction(FETCH_MY_PLAYERS)<{
	userId: number;
	leagueId: number;
}>();

export const fetchMyPlayersSuccess = createSwStandardAction(FETCH_MY_PLAYERS_SUCCESS)<{
	players: PlayerDto[];
	userId: number;
	leagueId: number;
	formation: string;
	preference: any;
}>();

export const fetchMyPlayersError = createSwStandardAction(FETCH_MY_PLAYERS_ERROR)<{
	userId: number;
	leagueId: number;
	errorCode: string;
	errorMessage: string;
}>();
