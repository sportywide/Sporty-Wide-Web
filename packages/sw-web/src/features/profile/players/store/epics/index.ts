import { map, switchMap } from 'rxjs/operators';
import { ContainerInstance } from 'typedi';
import { ProfilePlayersService } from '@web/features/profile/players/services/profile-players.service';
import { FETCH_PROFILE_PLAYERS } from '@web/features/profile/players/store/actions/actions.constants';
import { fetchProfilePlayersSuccess } from '@web/features/profile/players/store/actions';

export const fetchProfilePlayersEpic = (action$, state$, { container }: { container: ContainerInstance }) => {
	const profilePlayersService = container.get(ProfilePlayersService);
	return action$
		.ofType(FETCH_PROFILE_PLAYERS)
		.pipe(
			switchMap(({ payload: { userId, leagueId } }) =>
				profilePlayersService
					.getProfilePlayers({ userId, leagueId })
					.pipe(map(players => fetchProfilePlayersSuccess({ players, userId, leagueId })))
			)
		);
};
