import { map, mergeMap } from 'rxjs/operators';
import { IDependencies } from '@web/shared/lib/store';
import { LeagueService } from '@web/features/leagues/base/services/league.service';
import { fetchLeaguesSuccess } from '@web/features/leagues/base/store/actions';
import { FETCH_LEAGUES } from '@web/features/leagues/base/store/actions/actions.constants';

export const fetchLeaguesEpic = (action$, state$, { container }: IDependencies) => {
	const leagueService = container.get(LeagueService);
	return action$.ofType(FETCH_LEAGUES).pipe(
		mergeMap(() => {
			return leagueService.fetchLeagues().pipe(map(data => fetchLeaguesSuccess(data)));
		})
	);
};
