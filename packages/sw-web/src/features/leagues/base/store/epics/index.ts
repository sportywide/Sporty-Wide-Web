import { map, mergeMap } from 'rxjs/operators';
import { IDependencies } from '@web/shared/lib/store';
import { LeagueService } from '@web/features/leagues/base/services/league.service';
import { loadLeaguesSuccess } from '@web/features/leagues/base/store/actions';
import { LOAD_LEAGUES } from '@web/features/leagues/base/store/actions/actions.constants';

export const loadLeaguesEpic = (action$, state$, { container }: IDependencies) => {
	const leagueService = container.get(LeagueService);
	return action$.ofType(LOAD_LEAGUES).pipe(
		mergeMap(() => {
			return leagueService.loadLeagues().pipe(map(loadLeaguesSuccess));
		})
	);
};
