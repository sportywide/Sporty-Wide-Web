import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import {
	FETCH_USER_LEAGUE_SUCCESS,
	FETCH_USER_LEAGUES,
	JOIN_USER_LEAGUE,
	LEAVE_USER_LEAGUE,
} from '@web/features/leagues/user/store/actions/actions.constants';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { FormationName } from '@shared/lib/dtos/formation/formation.dto';

export const fetchUserLeagues = createSwStandardAction(FETCH_USER_LEAGUES)<number>();
export const fetchUserLeaguesSuccess = createSwStandardAction(FETCH_USER_LEAGUE_SUCCESS)<{
	leagues: LeagueDto[];
	userId: number;
}>();

export const joinUserLeague = createSwStandardAction(JOIN_USER_LEAGUE)<{
	leagueId: number;
	userId: number;
	formation: FormationName;
}>();

export const leaveUserLeague = createSwStandardAction(LEAVE_USER_LEAGUE)<{
	leagueId: number;
	userId: number;
}>();
