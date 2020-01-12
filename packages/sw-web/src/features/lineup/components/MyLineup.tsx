import React, { useCallback, useContext, useMemo } from 'react';
import { ContainerContext } from '@web/shared/lib/store';
import { ProfilePlayersService } from '@web/features/profile/players/services/profile-players.service';
import { useAsync } from 'react-async-hook';
import { sortPlayers } from '@web/features/players/utility/player';
import { ErrorMessage } from '@web/shared/lib/ui/components/error/Error';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';
import { SwDragLayer } from '@web/shared/lib/ui/components/dnd/DragLayer';
import { Button } from 'semantic-ui-react';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { ILineupState, lineupReducer } from '@web/features/lineup/store/reducers/lineup-reducer';
import { compose } from '@shared/lib/utils/fp/combine';
import { connect } from 'react-redux';
import { SwLineupBuilder } from './pitch/LineupBuilder';

interface IProps {
	leagueId: number;
	currentLineup: ILineupState;
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

const SwMyLineupComponent: React.FC<IProps> = function({ leagueId, currentLineup }) {
	const container = useContext(ContainerContext);
	const profilePlayerService = container.get(ProfilePlayersService);
	const fetchPlayerLineup = useCallback(
		async leagueId => {
			const { players = [], formation } = await profilePlayerService.getMyLineup(leagueId).toPromise();
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
	const numFilledPositions = useMemo(() => {
		const positions = currentLineup && currentLineup.positions.filter(position => position);
		return positions && positions.length;
	}, [currentLineup]);

	if (lineupResult.loading) {
		return <Spinner />;
	}

	const errorMessage = getErrorMessage(lineupResult);

	if (errorMessage) {
		return <ErrorMessage message={errorMessage} />;
	}

	return (
		<div className={'sw-flex sw-flex-column'}>
			<SwDragLayer />
			<SwLineupBuilder initialLineup={lineupResult.result} />
			<div className={'sw-flex-align-self-end'}>
				<Button primary disabled={numFilledPositions !== 11 || !!lineupResult.result?.playing?.length}>
					Bet
				</Button>
			</div>
		</div>
	);
};

const enhance = compose(
	registerReducer({ lineupBuilder: lineupReducer }),
	connect(state => ({ currentLineup: state.lineupBuilder }))
);
export const SwMyLineup = enhance(SwMyLineupComponent);
