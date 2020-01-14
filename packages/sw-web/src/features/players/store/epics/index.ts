import { map, switchMap } from 'rxjs/operators';
import { ContainerInstance } from 'typedi';
import { ProfilePlayersService } from '@web/features/players/services/profile-players.service';
import { FETCH_MY_BETTING, FETCH_MY_PLAYERS } from '@web/features/players/store/actions/actions.constants';
import { fetchMyBettingSuccess, fetchMyPlayersError, fetchMyPlayersSuccess } from '@web/features/players/store/actions';
import { catchAndThrow } from '@web/shared/lib/observable';
import { createStandardEpic } from '@web/shared/lib/redux/epic';
import { PlayerBettingDto } from '@shared/lib/dtos/player/player-betting.dto';
import { PlayerBettingService } from '@web/features/players/services/player-betting.service';

export const fetchMyPlayersEpic = (action$, state$, { container }: { container: ContainerInstance }) => {
	const profilePlayersService = container.get(ProfilePlayersService);
	return action$.ofType(FETCH_MY_PLAYERS).pipe(
		switchMap(({ payload: { leagueId } }) =>
			profilePlayersService.getMyPlayers({ leagueId, includes: ['stats'] }).pipe(
				map(({ players, formation, preference, errorCode, errorMessage }) => {
					if (errorCode && errorMessage) {
						return fetchMyPlayersError({ leagueId, errorCode, errorMessage });
					} else {
						return fetchMyPlayersSuccess({ players, leagueId, formation, preference });
					}
				}),
				catchAndThrow(() => fetchMyPlayersError({ leagueId, errorCode: '', errorMessage: 'Unexpected error' }))
			)
		)
	);
};

export const fetchMyBettingEpic = createStandardEpic<any, PlayerBettingDto[]>({
	actionType: FETCH_MY_BETTING,
	successAction: ({ payload }, data) => fetchMyBettingSuccess({ leagueId: payload.leagueId, betting: data }),
	effect: ({ payload: { week, leagueId } }, container) => {
		const fixtureService = container.get(PlayerBettingService);
		return fixtureService.getMyBetting({ leagueId, week });
	},
});
