import { map, switchMap } from 'rxjs/operators';
import { ContainerInstance } from 'typedi';
import { ProfilePlayersService } from '@web/features/players/services/profile-players.service';
import { FETCH_MY_BETTING, FETCH_MY_PLAYERS, SYNC_TOKEN } from '@web/features/players/store/actions/actions.constants';
import { fetchMyBettingSuccess, fetchMyPlayersError, fetchMyPlayersSuccess } from '@web/features/players/store/actions';
import { catchAndThrow } from '@web/shared/lib/observable';
import { of } from 'rxjs';
import { createStandardEpic } from '@web/shared/lib/redux/epic';
import { PlayerBettingDto } from '@shared/lib/dtos/player/player-betting.dto';
import { PlayerBettingService } from '@web/features/players/services/player-betting.service';
import { safeGet } from '@shared/lib/utils/object/get';
import { sum } from 'lodash';
import { useTokens } from '@web/features/user/store/actions';

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
		const playerBettingService = container.get(PlayerBettingService);
		return playerBettingService.getMyBetting({ leagueId, week });
	},
});

export const syncTokenEpic = createStandardEpic<{ leagueId: number; userId: number }, any>({
	actionType: SYNC_TOKEN,
	successAction: ({ payload }, data, state) => {
		const playerBetting: Record<number, PlayerBettingDto> = safeGet(
			() => state.value.playerBetting[payload.userId][payload.leagueId].players
		);
		if (!playerBetting) {
			return null;
		}
		// eslint-disable-next-line react-hooks/rules-of-hooks
		return useTokens(sum(Object.values(playerBetting).map(bet => bet.newBetTokens || 0)));
	},
	effect: () => {
		return of(undefined);
	},
});
