import React, { useCallback, useContext } from 'react';
import { ContainerContext } from '@web/shared/lib/store';
import { ProfilePlayersService } from '@web/features/profile/players/services/profile-players.service';
import { useAsync } from 'react-async-hook';
import { sortPlayers } from '@web/features/players/utility/player';
import { Loader } from 'semantic-ui-react';
import { SwIcon } from '@web/shared/lib/icon';
import { SwLineupBuilder } from './pitch/LineupBuilder';

interface IProps {
	leagueId: number;
}

function getErrorMessage(lineupResult) {
	let message;
	if (!lineupResult.result.hasPlayer) {
		message = "You don't have any player to play";
	} else if (lineupResult.error) {
		message = 'Unexpected error happened';
	}
	return message;
}

const SwMyLineupComponent: React.FC<IProps> = function({ leagueId }) {
	const container = useContext(ContainerContext);
	const profilePlayerService = container.get(ProfilePlayersService);
	const fetchPlayerLineup = useCallback(
		async leagueId => {
			const { players = [], formation } = await profilePlayerService
				.getMyPlayers({ leagueId, includes: ['team'] })
				.toPromise();
			return {
				playing: [],
				hasPlayer: players && players.length,
				reserved: sortPlayers(players),
				formation,
			};
		},
		[profilePlayerService]
	);
	const lineupResult = useAsync(fetchPlayerLineup, [leagueId]);

	if (lineupResult.loading) {
		return <Loader active />;
	}

	const errorMessage = getErrorMessage(lineupResult);

	if (errorMessage) {
		return (
			<div className={'sw-center sw-mt4'}>
				<SwIcon name={'sad'} width={150} height={150} />
				<div className={'sw-mt2'}>{errorMessage}</div>
			</div>
		);
	}

	return (
		<>
			<SwLineupBuilder initialLineup={lineupResult.result} />
		</>
	);
};

export const SwMyLineup = SwMyLineupComponent;
