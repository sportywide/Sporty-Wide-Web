import { concatMap, map, mergeMap } from 'rxjs/operators';
import {
	CHANGE_STRATEGY,
	FETCH_PLAYERS,
	FILL_POSITIONS,
	SUBSTITUTE_PLAYERS,
} from '@web/features/lineup/store/actions/actions.constants';
import {
	addPlayerToLineup,
	changeStrategySuccess,
	fetchPlayersSuccess,
	fillPositions,
	fillPositionSuccess,
	removePlayerFromLineup,
	substitutePlayers,
} from '@web/features/lineup/store/actions';
import { IDependencies } from '@web/shared/lib/store';
import { LineupService } from '@web/features/lineup/services/lineup.service';
import { Epic } from 'redux-observable';
import { ActionType, PayloadAction } from 'typesafe-actions';
import { sortPlayers } from '@web/features/players/utility/player';
import { ILineupState } from '@web/features/lineup/store/reducers/lineup-reducer';
import { EMPTY } from 'rxjs';
import { ProfilePlayersService } from '@web/features/profile/players/services/profile-players.service';
import { ContainerInstance } from 'typedi';

export const playerEpic = (action$, state$, { container }: { container: ContainerInstance }) => {
	return action$.ofType(FETCH_PLAYERS).pipe(
		mergeMap(async ({ payload: leagueId }) => {
			const profilePlayerService = container.get(ProfilePlayersService);
			const userId = state$.value.auth.user.id;
			const { players, formation } = await profilePlayerService
				.getProfilePlayers({ leagueId, userId, includes: ['team'] })
				.toPromise();
			return fetchPlayersSuccess({ players: sortPlayers(players), formation });
		})
	);
};

export const fillPositionsEpic: Epic<
	ActionType<typeof fillPositions>,
	PayloadAction<string, any>,
	{ lineupBuilder: ILineupState },
	IDependencies
> = (action$, state$, { container }) => {
	const lineupService = container.get(LineupService);
	return action$.ofType(FILL_POSITIONS as any).pipe(
		map(() => {
			const positions = state$.value.lineupBuilder.positions;
			const strategy = state$.value.lineupBuilder.strategy;
			const players = state$.value.lineupBuilder.players;
			const filledPositions = lineupService.fillPositions({
				players,
				positions,
				strategy,
			});
			return fillPositionSuccess(filledPositions);
		})
	);
};

export const substitutePlayersEpic: Epic<
	ActionType<typeof substitutePlayers>,
	PayloadAction<string, any>,
	{ lineupBuilder: ILineupState }
> = (action$, state$) => {
	return action$.ofType(SUBSTITUTE_PLAYERS as any).pipe(
		concatMap(({ payload }) => {
			const positions = state$.value.lineupBuilder.positions;
			const lineupPlayerIndex = positions.findIndex(position => position === payload.second);
			if (lineupPlayerIndex < 0) {
				return EMPTY;
			}
			return [
				addPlayerToLineup({ player: payload.first, index: lineupPlayerIndex }),
				removePlayerFromLineup(payload.second),
			];
		})
	);
};

export const changeStrategyEpic = (action$, $state, { container }) => {
	const lineupService = container.get(LineupService);
	return action$.ofType(CHANGE_STRATEGY as any).pipe(
		map(({ payload: formationName }) => {
			const formation = lineupService.getFormation(formationName);
			return changeStrategySuccess(formation);
		})
	);
};
