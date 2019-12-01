import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import {
	FETCH_LEAGUE_STANDING,
	FETCH_LEAGUE_STANDING_ERROR,
	FETCH_LEAGUE_STANDING_SUCCESS,
	FETCH_LEAGUES,
	FETCH_LEAGUES_SUCCESS,
} from '@web/features/leagues/base/store/actions/actions.constants';
import { LeagueStandingsDto } from '@shared/lib/dtos/leagues/league-standings.dto';

export const fetchLeagues = createSwStandardAction(FETCH_LEAGUES)();
export const fetchLeaguesSuccess = createSwStandardAction(FETCH_LEAGUES_SUCCESS)<LeagueDto[]>();

export const fetchLeagueStandings = createSwStandardAction(FETCH_LEAGUE_STANDING)<number>();
export const fetchLeagueStandingsSuccess = createSwStandardAction(FETCH_LEAGUE_STANDING_SUCCESS)<{
	leagueStandings: LeagueStandingsDto;
	leagueId: number;
}>();
export const fetchLeagueStandingsError = createSwStandardAction(FETCH_LEAGUE_STANDING_ERROR)<number>();
