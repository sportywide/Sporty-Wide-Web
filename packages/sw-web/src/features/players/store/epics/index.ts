import { loadPlayersSuccess } from '@web/features/players/store/actions';
import { map } from 'rxjs/operators';
import { keyBy } from 'lodash';
import { LOAD_PLAYERS } from '@web/features/players/store/actions/actions.constants';
import { sortPlayers } from '@web/features/players/store/reducers/player-reducer';
import players from './players.json';
import teams from './teams.json';

export const playerEpic = action$ => {
	return action$.ofType(LOAD_PLAYERS).pipe(
		map(() => {
			const teamMap = keyBy(teams, 'name');
			const playerDtos = players.map(player => ({
				...player,
				team: teamMap[player.teamName],
			}));

			return loadPlayersSuccess(sortPlayers(playerDtos));
		})
	);
};
