import { loadPlayersSuccess } from '@web/features/players/store/actions';
import { map } from 'rxjs/operators';
import { ADD_PLAYER_TO_LINEUP, REMOVE_PLAYER_FROM_LINEUP } from '@web/features/lineup/store/actions/actions.constants';

export const addPlayerToLineupEpic = (action$, state$) => {
	return action$.ofType(ADD_PLAYER_TO_LINEUP).pipe(
		map(({ payload: { player } }) => {
			const players = state$.value.playerList.players;
			const newPlayers = players.filter(({ id }) => id !== player.id);
			return loadPlayersSuccess(newPlayers);
		})
	);
};

export const removePlayerFromLineupEpic = (action$, state$) => {
	return action$.ofType(REMOVE_PLAYER_FROM_LINEUP).pipe(
		map(({ payload: { removedPlayer } }) => {
			const players = state$.value.playerList.players;
			const newPlayers = players.concat(removedPlayer);
			return loadPlayersSuccess(newPlayers);
		})
	);
};
