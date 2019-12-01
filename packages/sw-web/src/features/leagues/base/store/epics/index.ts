import { map, mergeMap } from 'rxjs/operators';
import { IDependencies } from '@web/shared/lib/store';
import { LeagueService } from '@web/features/leagues/base/services/league.service';
import {
	fetchLeaguesSuccess,
	fetchLeagueStandingsError,
	fetchLeagueStandingsSuccess,
} from '@web/features/leagues/base/store/actions';
import { FETCH_LEAGUE_STANDING, FETCH_LEAGUES } from '@web/features/leagues/base/store/actions/actions.constants';
import { createStandardEpic } from '@web/shared/lib/redux/epic';

export const fetchLeaguesEpic = (action$, state$, { container }: IDependencies) => {
	const leagueService = container.get(LeagueService);
	return action$.ofType(FETCH_LEAGUES).pipe(
		mergeMap(() => {
			return leagueService.fetchLeagues().pipe(map(data => fetchLeaguesSuccess(data)));
		})
	);
};

export const fetchLeaguesStandingEpic = createStandardEpic<number, any>({
	actionType: FETCH_LEAGUE_STANDING,
	effect: ({ payload: leagueId }, container) => {
		const leagueService = container.get(LeagueService);
		return leagueService.fetchLeagueStandings(leagueId);
	},
	successAction: (action, result) =>
		fetchLeagueStandingsSuccess({ leagueStandings: result, leagueId: action.payload }),
	errorAction: action => fetchLeagueStandingsError(action.payload),
});
