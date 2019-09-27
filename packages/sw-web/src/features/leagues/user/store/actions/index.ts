import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import {
	LOAD_USER_LEAGUE_SUCCESS,
	LOAD_USER_LEAGUES,
} from '@web/features/leagues/user/store/actions/actions.constants';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';

export const loadUserLeagues = createSwStandardAction(LOAD_USER_LEAGUES)<number>();
export const loadUserLeaguesSuccess = createSwStandardAction(LOAD_USER_LEAGUE_SUCCESS)<{
	leagues: LeagueDto[];
	userId: number;
}>();
