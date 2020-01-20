import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { PlayerBettingDto } from '@shared/lib/dtos/player/player-betting.dto';
import {
	FETCH_MY_BETTING,
	FETCH_MY_BETTING_SUCCESS,
	FETCH_MY_PLAYERS,
	FETCH_MY_PLAYERS_ERROR,
	FETCH_MY_PLAYERS_SUCCESS,
	SYNC_TOKEN,
	UPDATE_RATING,
	UPDATE_TOKEN,
} from './actions.constants';

export const fetchMyPlayers = createSwStandardAction(FETCH_MY_PLAYERS)<{
	leagueId: number;
}>();

export const fetchMyBetting = createSwStandardAction(FETCH_MY_BETTING)<{
	leagueId: number;
}>();

export const fetchMyBettingSuccess = createSwStandardAction(FETCH_MY_BETTING_SUCCESS)<{
	leagueId: number;
	betting: PlayerBettingDto[];
}>();

export const updateRating = createSwStandardAction(UPDATE_RATING)<{
	userId: number;
	leagueId: number;
	rating: number;
	playerId: number;
}>();

export const updateToken = createSwStandardAction(UPDATE_TOKEN)<{
	userId: number;
	leagueId: number;
	tokens: number;
	playerId: number;
}>();

export const fetchMyPlayersSuccess = createSwStandardAction(FETCH_MY_PLAYERS_SUCCESS)<{
	players: PlayerDto[];
	leagueId: number;
	formation: string;
	preference: any;
}>();

export const fetchMyPlayersError = createSwStandardAction(FETCH_MY_PLAYERS_ERROR)<{
	leagueId: number;
	errorCode: string;
	errorMessage: string;
}>();

export const syncToken = createSwStandardAction(SYNC_TOKEN)<{
	leagueId: number;
	userId: number;
}>();
