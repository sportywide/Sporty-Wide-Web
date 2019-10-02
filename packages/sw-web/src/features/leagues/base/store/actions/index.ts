import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { FETCH_LEAGUES, FETCH_LEAGUES_SUCCESS } from '@web/features/leagues/base/store/actions/actions.constants';

export const loadLeagues = createSwStandardAction(FETCH_LEAGUES)();
export const loadLeaguesSuccess = createSwStandardAction(FETCH_LEAGUES_SUCCESS)<LeagueDto[]>();
