import React, { useCallback, useContext, useMemo } from 'react';
import { ContainerContext } from '@web/shared/lib/store';
import { ProfilePlayersService } from '@web/features/players/services/profile-players.service';
import { useAsync, useAsyncCallback } from 'react-async-hook';
import { sortPlayers } from '@web/features/players/utility/player';
import { ErrorMessage } from '@web/shared/lib/ui/components/error/Error';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';
import { SwDragLayer } from '@web/shared/lib/ui/components/dnd/DragLayer';
import { Button, Message } from 'semantic-ui-react';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { ILineupState, lineupReducer } from '@web/features/lineup/store/reducers/lineup-reducer';
import { compose } from '@shared/lib/utils/fp/combine';
import { connect } from 'react-redux';
import { keyBy } from 'lodash';
import { SwApp } from '@web/shared/lib/app';
import { redirect } from '@web/shared/lib/navigation/helper';
import { SwLineupBuilder } from './pitch/LineupBuilder';

interface IProps {
	leagueId: number;
	currentLineup: ILineupState;
}

function getErrorMessage(lineupResult) {
	let message;
	if (lineupResult.error) {
		message = `Unexpected error happened`;
	} else if (!lineupResult.result.hasPlayer) {
		message = "You don't have any player to play";
	}
	return message;
}

const SwMyLineupComponent: React.FC<IProps> = function({ leagueId, currentLineup }) {
	const container = useContext(ContainerContext);
	const profilePlayerService = container.get(ProfilePlayersService);
	const fetchPlayerLineup = useCallback(
		async leagueId => {
			const { players: allPlayers = [], formation, positions } = await profilePlayerService
				.getMyLineup(leagueId)
				.toPromise();
			const playerMap = keyBy(allPlayers, 'id');
			const numPlaying = positions.filter(value => value).length;
			const reserved = allPlayers.filter(player => !positions.includes(player.id));
			return {
				numPlaying,
				playing: positions.map(position => position && playerMap[position]),
				hasPlayer: allPlayers && allPlayers.length,
				reserved: sortPlayers(reserved),
				formation,
			};
		},
		[profilePlayerService]
	);
	const lineupResult = useAsync(fetchPlayerLineup, [leagueId]);
	const saveBetting = useAsyncCallback(async positions => {
		await profilePlayerService
			.saveMyLineup({
				leagueId,
				positions,
			})
			.toPromise();
	});
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
				{lineupResult.result.numPlaying === 0 ? (
					<Button
						primary
						disabled={saveBetting.loading || numFilledPositions === 0}
						onClick={() => {
							const swApp = container.get(SwApp);
							swApp.showConfirm({
								content: 'Once you proceed, you will not be able to change your lineup again',
								onConfirm: async close => {
									close();
									await saveBetting.execute(currentLineup.positions);
									redirect({
										replace: true,
										params: {
											id: leagueId,
											tab: 'betting',
										},
										route: 'play-league',
										refresh: true,
									});
								},
							});
						}}
					>
						Start betting
					</Button>
				) : (
					<Message warning>You have already created your line up</Message>
				)}
			</div>
		</div>
	);
};

const enhance = compose(
	registerReducer({ lineupBuilder: lineupReducer }),
	connect(state => ({ currentLineup: state.lineupBuilder }))
);
export const SwMyLineup = enhance(SwMyLineupComponent);
