import { addPlayersToList, loadPlayersSuccess, removePlayersFromList } from '@web/features/players/store/actions';
import { concatMap, map, mergeMap } from 'rxjs/operators';
import {
	ADD_PLAYER_TO_LINEUP,
	FILL_POSITIONS,
	REMOVE_PLAYER_FROM_LINEUP,
	SUBSTITUTE_PLAYER,
} from '@web/features/lineup/store/actions/actions.constants';
import {
	addPlayerToLineup,
	fillPositions,
	fillPositionSuccess,
	removePlayerFromLineup,
	substitutePlayer,
} from '@web/features/lineup/store/actions';
import { IDependencies } from '@web/shared/lib/store';
import { LineupService } from '@web/features/lineup/services/lineup.service';
import { Epic } from 'redux-observable';
import { ActionType, PayloadAction } from 'typesafe-actions';
import { IPlayerState } from '@web/features/players/store/reducers/player-reducer';
import { ILineupState } from '@web/features/lineup/store/reducers/lineup-reducer';
import { EMPTY, of } from 'rxjs';

export const addPlayerToLineupEpic: Epic<
	ActionType<typeof addPlayerToLineup>,
	PayloadAction<string, any>,
	{ playerList: IPlayerState }
> = action$ => {
	return action$.ofType(ADD_PLAYER_TO_LINEUP as any).pipe(
		map(({ payload: { player } }) => {
			return removePlayersFromList([player]);
		})
	);
};

export const fillPositionsEpic: Epic<
	ActionType<typeof fillPositions>,
	PayloadAction<string, any>,
	{ playerList: IPlayerState; lineup: ILineupState },
	IDependencies
> = (action$, state$, { container }) => {
	const lineupService = container.get(LineupService);
	return action$.ofType(FILL_POSITIONS as any).pipe(
		mergeMap(() => {
			const positions = state$.value.lineup.positions;
			const strategy = state$.value.lineup.strategy;
			const players = state$.value.playerList.players;
			const filledPositions = lineupService.fillPositions({
				players,
				positions,
				strategy,
			});
			const newPlayers = players.filter(player => !filledPositions.includes(player));
			return of(fillPositionSuccess(filledPositions), loadPlayersSuccess(newPlayers));
		})
	);
};

export const substitutePlayerEpic: Epic<
	ActionType<typeof substitutePlayer>,
	PayloadAction<string, any>,
	{ playerList: IPlayerState; lineup: ILineupState }
> = (action$, state$) => {
	return action$.ofType(SUBSTITUTE_PLAYER as any).pipe(
		concatMap(({ payload }) => {
			const positions = state$.value.lineup.positions;
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

export const removePlayerFromLineupEpic: Epic<
	ActionType<typeof removePlayerFromLineup>,
	PayloadAction<string, any>,
	{ playerList: IPlayerState }
> = action$ => {
	return action$.ofType(REMOVE_PLAYER_FROM_LINEUP as any).pipe(
		map(({ payload: player }) => {
			return addPlayersToList([player]);
		})
	);
};
