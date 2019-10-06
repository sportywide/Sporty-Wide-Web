import { concatMap, map } from 'rxjs/operators';
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
import teams from '@web/features/lineup/store/epics/teams.json';
import players from '@web/features/lineup/store/epics/players.json';
import { keyBy } from 'lodash';
import { sortPlayers } from '@web/features/players/utility/player';
import { ILineupState } from '@web/features/lineup/store/reducers/lineup-reducer';
import { EMPTY } from 'rxjs';

export const playerEpic = action$ => {
	return action$.ofType(FETCH_PLAYERS).pipe(
		map(() => {
			const teamMap = keyBy(teams, 'name');
			const playerDtos = players.map(player => ({
				...player,
				team: teamMap[player.teamName],
			}));

			return fetchPlayersSuccess(sortPlayers(playerDtos));
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
