import React, { useContext } from 'react';
import { useEffectOnce, useUser } from '@web/shared/lib/react/hooks';
import { compose } from '@shared/lib/utils/fp/combine';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { fetchMyBettingEpic, syncTokenEpic } from '@web/features/players/store/epics';
import { safeGet } from '@shared/lib/utils/object/get';
import { connect } from 'react-redux';
import { fetchMyBetting, syncToken, updateRating, updateToken } from '@web/features/players/store/actions';
import { fetchWeeklyFixturesForTeams } from '@web/features/fixtures/store/actions';
import { playerBettingReducer } from '@web/features/players/store/reducers';
import { ContainerContext, getUserIdFromState } from '@web/shared/lib/store';
import { Button, Message } from 'semantic-ui-react';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';
import { PlayerBettingDto, PlayerBettingInputDto } from '@shared/lib/dtos/player/player-betting.dto';
import { SwNumberInput } from '@web/shared/lib/ui/components/number/NumberInput';
import { redirect } from '@web/shared/lib/navigation/helper';
import { sortProperty } from '@shared/lib/utils/object/sort';
import { comparePlayerFunc } from '@web/features/players/utility/player';
import { SwApp } from '@web/shared/lib/app';
import { useAsyncCallback } from 'react-async-hook';
import { format } from 'date-fns';
import { PlayerBettingService } from '@web/features/players/services/player-betting.service';
import { IUserScoreState, userScoreReducer } from '@web/features/user/store/reducers';
import { resetMyScore } from '@web/features/user/store/actions';
import { StickyTable, TableCell, TableRow, TableHeader } from '@web/shared/lib/ui/components/table/Table';

interface IProps {
	playerBetting: Record<number, PlayerBettingDto>;
	leagueId: number;
	fetchMyBetting: typeof fetchMyBetting;
	updateRating: typeof updateRating;
	updateToken: typeof updateToken;
	syncToken: typeof syncToken;
	userScore: IUserScoreState;
	resetMyScore: typeof resetMyScore;
}

const SwMyPlayerBettingComponent: React.FC<IProps> = ({
	leagueId,
	playerBetting,
	fetchMyBetting,
	updateRating,
	updateToken,
	userScore,
	syncToken,
	resetMyScore,
}) => {
	const user = useUser();
	const container = useContext(ContainerContext);
	const bettingService = container.get(PlayerBettingService);
	useEffectOnce(() => {
		fetchMyBetting({
			leagueId,
		});

		return () => {
			resetMyScore();
		};
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
		return <Spinner portalRoot={'#container'} />;
	}
	const alreadyBet = hasPlayerBet(playerBetting);
	return (
		<div className={'sw-flex sw-flex-column sw-fit'}>
			{alreadyBet && <span className={'sw-mt2 sw-mb2'}>Last bet was {getLastBet(playerBetting)}</span>}
			<StickyTable>
				<TableRow>
					<TableHeader>Name</TableHeader>
					<TableHeader>Team</TableHeader>
					<TableHeader>Game</TableHeader>
					<TableHeader>Used Tokens</TableHeader>
					<TableHeader>Bet Rating</TableHeader>
					<TableHeader>Real Rating</TableHeader>
					<TableHeader>Earned Tokens</TableHeader>
				</TableRow>

				{sortProperty(Object.values(playerBetting), 'player', comparePlayerFunc).map(betting => (
					<TableRow key={betting.playerId}>
						<TableCell>
							{betting.player.name} ({betting.player.positions.join(', ')})
						</TableCell>
						<TableCell>{betting.player.teamName}</TableCell>
						<TableCell>
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
						</TableCell>
						<TableCell>
							<SwNumberInput
								stepAmount={1}
								disabled={betting.betTokens != undefined}
								value={betting.newBetTokens || 0}
								precision={0}
								maxValue={userScore.current.tokens}
								onChange={tokens =>
									updateToken({
										userId: user.id,
										leagueId: betting.leagueId,
										playerId: betting.playerId,
										tokens,
									})
								}
								onBlur={() =>
									syncToken({
										userId: user.id,
										leagueId: betting.leagueId,
									})
								}
								minValue={0}
							/>
						</TableCell>
						<TableCell>
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
						</TableCell>
						<TableCell>{betting.realRating}</TableCell>
						<TableCell>{betting.earnedTokens}</TableCell>
					</TableRow>
				))}
			</StickyTable>
			<div className={'sw-flex sw-flex-center sw-flex-align-self-end sw-mt3'}>
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
									window.location.reload();
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

function getLastBet(playerBetting: Record<number, PlayerBettingDto>) {
	return format(new Date(Object.values(playerBetting)[0].betTime), 'dd-MM-yyyy HH:mm:ss');
}

function hasPlayerBet(playerBetting: Record<number, PlayerBettingDto>) {
	return Object.values(playerBetting).some(betting => betting.betTime != undefined);
}
const enhancer = compose(
	registerReducer({
		playerBetting: playerBettingReducer,
		userScore: {
			reducer: userScoreReducer,
			unmount: false,
		},
	}),
	registerEpic(fetchMyBettingEpic, syncTokenEpic),
	connect(
		(state, ownProps) => {
			const userId = getUserIdFromState(state);
			return {
				playerBetting: safeGet(() => state.playerBetting[userId][ownProps.leagueId].players),
				userScore: state.userScore,
			};
		},
		{
			fetchMyBetting,
			updateToken,
			syncToken,
			fetchWeeklyFixturesForTeams,
			updateRating,
			resetMyScore,
		}
	)
);

export const SwMyPlayersBetting = enhancer(SwMyPlayerBettingComponent);
