import { map, mapTo, mergeMap } from 'rxjs/operators';
import {
	JOIN_USER_LEAGUE,
	LEAVE_USER_LEAGUE,
	LOAD_USER_LEAGUES,
} from '@web/features/leagues/user/store/actions/actions.constants';
import { IDependencies } from '@web/shared/lib/store';
import { UserLeagueService } from '@web/features/leagues/user/services/user-league.service';
import {
	joinUserLeague,
	leaveUserLeague,
	loadUserLeagues,
	loadUserLeaguesSuccess,
} from '@web/features/leagues/user/store/actions';
import { ActionType } from 'typesafe-actions';
import { Epic } from 'redux-observable';

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

export const joinUserLeagueEpic: Epic<ActionType<typeof joinUserLeague>, any, any, IDependencies> = (
	action$,
	state$,
	{ container }: IDependencies
) => {
	const userLeagueService = container.get(UserLeagueService);
	return action$.ofType(JOIN_USER_LEAGUE as any).pipe(
		mergeMap(({ payload: { userId, leagueId } }) => {
			return userLeagueService.joinLeague({ leagueId, userId }).pipe(mapTo(loadUserLeagues(userId)));
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
			return userLeagueService.leaveLeague({ userId, leagueId }).pipe(mapTo(loadUserLeagues(userId)));
		})
	);
};
