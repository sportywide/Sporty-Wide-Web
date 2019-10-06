import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { FETCH_LEAGUES, FETCH_LEAGUES_SUCCESS } from '@web/features/leagues/base/store/actions/actions.constants';

export const fetchLeagues = createSwStandardAction(FETCH_LEAGUES)();
export const fetchLeaguesSuccess = createSwStandardAction(FETCH_LEAGUES_SUCCESS)<LeagueDto[]>();
