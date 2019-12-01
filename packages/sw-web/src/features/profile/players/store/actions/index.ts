import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { FETCH_PROFILE_PLAYERS, FETCH_PROFILE_PLAYERS_SUCCESS } from './actions.constants';

export const fetchProfilePlayers = createSwStandardAction(FETCH_PROFILE_PLAYERS)<{
	userId: number;
	leagueId: number;
}>();

export const fetchProfilePlayersSuccess = createSwStandardAction(FETCH_PROFILE_PLAYERS_SUCCESS)<{
	players: PlayerDto[];
	userId: number;
	leagueId: number;
	formation: string;
	preference: any;
}>();
