import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { LOAD_LEAGUES, LOAD_LEAGUES_SUCCESS } from '@web/features/leagues/base/store/actions/actions.constants';

export const loadLeagues = createSwStandardAction(LOAD_LEAGUES)();
export const loadLeaguesSuccess = createSwStandardAction(LOAD_LEAGUES_SUCCESS)<LeagueDto[]>();
