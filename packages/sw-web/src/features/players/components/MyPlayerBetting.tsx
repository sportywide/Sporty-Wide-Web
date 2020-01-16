import React, { useContext } from 'react';
import { useEffectOnce, useUser } from '@web/shared/lib/react/hooks';
import { compose } from '@shared/lib/utils/fp/combine';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { fetchMyBettingEpic } from '@web/features/players/store/epics';
import { safeGet } from '@shared/lib/utils/object/get';
import { connect } from 'react-redux';
import { fetchMyBetting, updateRating, updateToken } from '@web/features/players/store/actions';
import { fetchWeeklyFixturesForTeams } from '@web/features/fixtures/store/actions';
import { playerBettingReducer } from '@web/features/players/store/reducers';
import { ContainerContext, getUserIdFromState } from '@web/shared/lib/store';
import { Table, Button, Message } from 'semantic-ui-react';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';
import { PlayerBettingDto, PlayerBettingInputDto } from '@shared/lib/dtos/player/player-betting.dto';
import { SwNumberInput } from '@web/shared/lib/ui/components/number/NumberInput';
import { redirect } from '@web/shared/lib/navigation/helper';
import { sortProperty } from '@shared/lib/utils/object/sort';
import { comparePlayerFunc } from '@web/features/players/utility/player';
import { SwApp } from '@web/shared/lib/app';
import { useAsyncCallback } from 'react-async-hook';
import { PlayerBettingService } from '@web/features/players/services/player-betting.service';

interface IProps {
	playerBetting: Record<number, PlayerBettingDto>;
	leagueId: number;
	fetchMyBetting: typeof fetchMyBetting;
	updateRating: typeof updateRating;
	updateToken: typeof updateToken;
}

const SwMyPlayerBettingComponent: React.FC<IProps> = ({
	leagueId,
	playerBetting,
	fetchMyBetting,
	updateRating,
	updateToken,
}) => {
	const user = useUser();
	const container = useContext(ContainerContext);
	const bettingService = container.get(PlayerBettingService);
	useEffectOnce(() => {
		fetchMyBetting({
			leagueId,
		});
	});
	const saveBetting = useAsyncCallback(async (betting: PlayerBettingInputDto[]) => {
		await bettingService
			.saveBetting({
				leagueId,
				betting,
			})
			.toPromise();
	});
	if (!playerBetting) {
		return <Spinner />;
	}
	const alreadyBet = hasPlayerBet(playerBetting);
	return (
		<div className={'sw-flex sw-flex-column'}>
			<Table padded stackable>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Name</Table.HeaderCell>
						<Table.HeaderCell>Team</Table.HeaderCell>
						<Table.HeaderCell>Game</Table.HeaderCell>
						<Table.HeaderCell>Used Tokens</Table.HeaderCell>
						<Table.HeaderCell>Bet Rating</Table.HeaderCell>
						<Table.HeaderCell>Real Rating</Table.HeaderCell>
						<Table.HeaderCell>Earned Tokens</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{sortProperty(Object.values(playerBetting), 'player', comparePlayerFunc).map(betting => (
						<Table.Row key={betting.playerId}>
							<Table.Cell>
								{betting.player.name} ({betting.player.positions.join(', ')})
							</Table.Cell>
							<Table.Cell>{betting.player.teamName}</Table.Cell>
							<Table.Cell>
								<a
									className={'sw-link'}
									onClick={async () => {
										await redirect({
											refresh: false,
											route: 'fixture-details',
											params: { id: betting.fixture.id },
										});
									}}
								>
									{betting.fixture.home} - {betting.fixture.away}
								</a>
							</Table.Cell>
							<Table.Cell>
								<SwNumberInput
									stepAmount={1}
									disabled={betting.betTokens != undefined}
									value={betting.newBetTokens || 0}
									precision={0}
									onChange={token =>
										updateToken({
											userId: user.id,
											leagueId: betting.leagueId,
											playerId: betting.playerId,
											token,
										})
									}
									minValue={0}
								/>
							</Table.Cell>
							<Table.Cell>
								<SwNumberInput
									stepAmount={0.1}
									minValue={0}
									precision={1}
									disabled={betting.betRating != undefined}
									maxValue={10}
									value={betting.newBetRating || 0}
									onChange={rating =>
										updateRating({
											userId: user.id,
											leagueId: betting.leagueId,
											playerId: betting.playerId,
											rating,
										})
									}
								/>
							</Table.Cell>
							<Table.Cell>{betting.realRating}</Table.Cell>
							<Table.Cell>{betting.earnedTokens}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
			<div className={'sw-flex-align-self-end'}>
				{alreadyBet ? (
					<Message warning>You cannot bet again</Message>
				) : (
					<Button
						primary
						disabled={saveBetting.loading}
						onClick={() => {
							const swApp = container.get(SwApp);
							swApp.showConfirm({
								content: 'You will not be able to bet again. Are you sure?',
								onConfirm: async close => {
									close();
									await saveBetting.execute(
										Object.values(playerBetting).map(betting => ({
											betTokens: betting.newBetTokens || 0,
											betRating: betting.newBetRating || 0,
											playerId: betting.playerId,
											fixtureId: betting.fixtureId,
										}))
									);
								},
							});
						}}
					>
						Bet
					</Button>
				)}
			</div>
		</div>
	);
};

function hasPlayerBet(playerBetting: Record<number, PlayerBettingDto>) {
	return Object.values(playerBetting).some(betting => betting.betTime != undefined);
}
const enhancer = compose(
	registerReducer({
		playerBetting: playerBettingReducer,
	}),
	registerEpic(fetchMyBettingEpic),
	connect(
		(state, ownProps) => {
			const userId = getUserIdFromState(state);
			return {
				playerBetting: safeGet(() => state.playerBetting[userId][ownProps.leagueId].players),
			};
		},
		{
			fetchMyBetting,
			updateToken,
			fetchWeeklyFixturesForTeams,
			updateRating,
		}
	)
);

export const SwMyPlayersBetting = enhancer(SwMyPlayerBettingComponent);
