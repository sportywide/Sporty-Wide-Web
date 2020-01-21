import { concatMap, map } from 'rxjs/operators';
import {
	CHANGE_STRATEGY,
	FILL_POSITIONS,
	SUBSTITUTE_PLAYERS,
} from '@web/features/lineup/store/actions/actions.constants';
import {
	addPlayerToLineup,
	changeStrategySuccess,
	fillPositions,
	fillPositionSuccess,
	removePlayerFromLineup,
	substitutePlayers,
} from '@web/features/lineup/store/actions';
import { IDependencies } from '@web/shared/lib/store';
import { LineupService } from '@web/features/lineup/services/lineup.service';
import { Epic } from 'redux-observable';
import { ActionType, PayloadMetaAction } from 'typesafe-actions';
import { ILineupState } from '@web/features/lineup/store/reducers/lineup-reducer';
import { EMPTY } from 'rxjs';

export const fillPositionsEpic: Epic<
	ActionType<typeof fillPositions>,
	PayloadMetaAction<string, any, any>,
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
	PayloadMetaAction<string, any, any>,
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
	return action$.ofType(CHANGE_STRATEGY).pipe(
		map<any, any>(({ payload: formationName }) => {
			const formation = lineupService.getFormation(formationName);
			return changeStrategySuccess(formation);
		})
	);
};
