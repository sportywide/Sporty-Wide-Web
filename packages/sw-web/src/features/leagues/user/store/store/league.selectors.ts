import { createSelector } from 'reselect';
import memoize from 'lodash.memoize';

export function userLeagueSelector() {
	const leagueSelector = state => state.leagues;
	const userLeagueSelector = state => state.userLeagues;

	return createSelector(
		[leagueSelector, userLeagueSelector],
		(leagues, userLeagueMap = {}) =>
			memoize(userId => {
				const userLeagues = userLeagueMap[userId];
				if (!(leagues && userLeagues)) {
					return undefined;
				}

				return leagues.map(league => {
					const userLeague = userLeagues.find(currentUserLeague => currentUserLeague.id === league.id);
					if (userLeague) {
						return {
							...userLeague,
							selected: true,
						};
					}
					return {
						...league,
						selected: false,
					};
				});
			})
	);
}
