import { map, switchMap } from 'rxjs/operators';
import { ContainerInstance } from 'typedi';
import { ProfilePlayersService } from '@web/features/profile/players/services/profile-players.service';
import { FETCH_MY_PLAYERS } from '@web/features/profile/players/store/actions/actions.constants';
import { fetchMyPlayersError, fetchMyPlayersSuccess } from '@web/features/profile/players/store/actions';
import { catchAndThrow } from '@web/shared/lib/observable';

export const fetchMyPlayersEpic = (action$, state$, { container }: { container: ContainerInstance }) => {
	const profilePlayersService = container.get(ProfilePlayersService);
	const userId = state$.value.auth.user.id;
	return action$.ofType(FETCH_MY_PLAYERS).pipe(
		switchMap(({ payload: { leagueId } }) =>
			profilePlayersService.getMyPlayers({ leagueId, includes: ['stats'] }).pipe(
				map(({ players, formation, preference, errorCode, errorMessage }) => {
					if (errorCode && errorMessage) {
						return fetchMyPlayersError({ userId, leagueId, errorCode, errorMessage });
					} else {
						return fetchMyPlayersSuccess({ players, userId, leagueId, formation, preference });
					}
				}),
				catchAndThrow(() =>
					fetchMyPlayersError({ userId, leagueId, errorCode: '', errorMessage: 'Unexpected error' })
				)
			)
		)
	);
};
