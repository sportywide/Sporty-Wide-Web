import React, { useCallback, useContext } from 'react';
import { ContainerContext } from '@web/shared/lib/store';
import { ProfilePlayersService } from '@web/features/profile/players/services/profile-players.service';
import { useAsync } from 'react-async-hook';
import { sortPlayers } from '@web/features/players/utility/player';
import { ErrorMessage } from '@web/shared/lib/ui/components/error/Error';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';
import { SwDragLayer } from '@web/shared/lib/ui/components/dnd/DragLayer';
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
		return <Spinner />;
	}

	const errorMessage = getErrorMessage(lineupResult);

	if (errorMessage) {
		return <ErrorMessage message={errorMessage} />;
	}

	return (
		<>
			<SwDragLayer />
			<SwLineupBuilder initialLineup={lineupResult.result} />
		</>
	);
};

export const SwMyLineup = SwMyLineupComponent;
