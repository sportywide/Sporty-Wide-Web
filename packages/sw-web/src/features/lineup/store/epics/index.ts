import { loadPlayersSuccess } from '@web/features/players/store/actions';
import { map, mergeMap } from 'rxjs/operators';
import {
	ADD_PLAYER_TO_LINEUP,
	FILL_POSITIONS,
	REMOVE_PLAYER_FROM_LINEUP,
} from '@web/features/lineup/store/actions/actions.constants';
import {
	addPlayerToLineup,
	fillPositions,
	fillPositionSuccess,
	removePlayerFromLineup,
} from '@web/features/lineup/store/actions';
import { IDependencies } from '@web/shared/lib/store';
import { LineupService } from '@web/features/lineup/services/lineup.service';
import { Epic } from 'redux-observable';
import { ActionType, PayloadAction } from 'typesafe-actions';
import { IPlayerState } from '@web/features/players/store/reducers/player-reducer';
import { ILineupState } from '@web/features/lineup/store/reducers/lineup-reducer';
import { of } from 'rxjs';

export const addPlayerToLineupEpic: Epic<
	ActionType<typeof addPlayerToLineup>,
	PayloadAction<string, any>,
	{ playerList: IPlayerState }
> = (action$, state$) => {
	return action$.ofType(ADD_PLAYER_TO_LINEUP as any).pipe(
		map(({ payload: { player } }) => {
			const players = state$.value.playerList.players;
			const newPlayers = players.filter(({ id }) => id !== player.id);
			return loadPlayersSuccess(newPlayers);
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

export const removePlayerFromLineupEpic: Epic<
	ActionType<typeof removePlayerFromLineup>,
	PayloadAction<string, any>,
	{ playerList: IPlayerState }
> = (action$, state$) => {
	return action$.ofType(REMOVE_PLAYER_FROM_LINEUP as any).pipe(
		map(({ payload: { removedPlayer } }) => {
			const players = state$.value.playerList.players;
			const newPlayers = players.concat(removedPlayer);
			return loadPlayersSuccess(newPlayers);
		})
	);
};
