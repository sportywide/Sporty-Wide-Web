import { map, mapTo, mergeMap } from 'rxjs/operators';
import {
	FETCH_USER_LEAGUES,
	JOIN_USER_LEAGUE,
	LEAVE_USER_LEAGUE,
} from '@web/features/leagues/user/store/actions/actions.constants';
import { IDependencies } from '@web/shared/lib/store';
import { UserLeagueService } from '@web/features/leagues/user/services/user-league.service';
import {
	fetchUserLeagues,
	fetchUserLeaguesSuccess,
	joinUserLeague,
	joinUserLeagueError,
	joinUserLeagueSuccess,
	leaveUserLeague,
} from '@web/features/leagues/user/store/actions';
import { ActionType } from 'typesafe-actions';
import { Epic } from 'redux-observable';
import { catchAndThrow } from '@web/shared/lib/observable';

export const fetchUserLeagueEpic = (action$, state$, { container }: IDependencies) => {
	const userLeagueService = container.get(UserLeagueService);
	return action$.ofType(FETCH_USER_LEAGUES).pipe(
		mergeMap(({ payload: userId }) => {
			return userLeagueService
				.fetchUserLeagues(userId)
				.pipe(map(userLeagues => fetchUserLeaguesSuccess({ leagues: userLeagues, userId })));
		})
	);
};

export const joinUserLeagueEpic: Epic<ActionType<typeof joinUserLeague>, any, any, IDependencies> = (
	action$,
	state$,
	{ container }: IDependencies
) => {
	const userLeagueService = container.get(UserLeagueService);
	return action$.ofType(JOIN_USER_LEAGUE as any).pipe(
		mergeMap(({ payload: { userId, leagueId, formation } }) => {
			return userLeagueService.joinLeague({ leagueId, userId, formation }).pipe(
				mapTo(joinUserLeagueSuccess({ leagueId, userId })),
				catchAndThrow(() => joinUserLeagueError({ leagueId, userId }))
			);
		})
	);
};

export const leaveUserLeagueEpic: Epic<ActionType<typeof leaveUserLeague>, any, any, IDependencies> = (
	action$,
	state$,
	{ container }: IDependencies
) => {
	const userLeagueService = container.get(UserLeagueService);
	return action$.ofType(LEAVE_USER_LEAGUE as any).pipe(
		mergeMap(({ payload: { leagueId, userId } }) => {
			return userLeagueService.leaveLeague({ userId, leagueId }).pipe(mapTo(fetchUserLeagues(userId)));
		})
	);
};
