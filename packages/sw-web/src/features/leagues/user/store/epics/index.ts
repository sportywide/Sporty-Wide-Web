import { map, mergeMap } from 'rxjs/operators';
import { LOAD_USER_LEAGUES } from '@web/features/leagues/user/store/actions/actions.constants';
import { IDependencies } from '@web/shared/lib/store';
import { UserLeagueService } from '@web/features/leagues/user/services/user-league.service';
import { loadUserLeaguesSuccess } from '@web/features/leagues/user/store/actions';

export const loadUserLeagueEpic = (action$, state$, { container }: IDependencies) => {
	const userLeagueService = container.get(UserLeagueService);
	return action$.ofType(LOAD_USER_LEAGUES).pipe(
		mergeMap(({ payload: userId }) => {
			return userLeagueService
				.loadUserLeagues(userId)
				.pipe(map(userLeagues => loadUserLeaguesSuccess({ leagues: userLeagues, userId })));
		})
	);
};
