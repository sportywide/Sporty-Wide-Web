import React, { useContext, useEffect, useState } from 'react';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { Button, Grid, Icon, Select } from 'semantic-ui-react';
import { IProfilePlayers, profilePlayersReducer } from '@web/features/profile/players/store/reducers';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { fetchMyPlayersEpic } from '@web/features/profile/players/store/epics';
import { fetchMyPlayers } from '@web/features/profile/players/store/actions';
import { compose } from '@shared/lib/utils/fp/combine';
import { connect } from 'react-redux';
import { useFormationOptions, useUser } from '@web/shared/lib/react/hooks';
import { safeGet } from '@shared/lib/utils/object/get';
import { ContainerContext } from '@web/shared/lib/store';
import { UserLeagueService } from '@web/features/leagues/user/services/user-league.service';
import { get } from 'lodash';
import { fetchWeeklyFixtureForTeamsEpic } from '@web/features/fixtures/store/epics';
import { fixtureReducer } from '@web/features/fixtures/store/reducers';
import { fetchWeeklyFixturesForTeams } from '@web/features/fixtures/store/actions';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';
import { SwPlayerStatCard } from '@web/features/profile/players/components/PlayerStatCard';
import { redirect } from '@web/shared/lib/navigation/helper';
import { device } from '@web/styles/constants/size';
import styled from 'styled-components';
import {
	NOT_ENOUGH_FIXTURES,
	NOT_IN_SEASON_CODE,
	NOT_IN_WEEKDAY,
	NOT_PLAYING,
} from '@shared/lib/exceptions/generate-player-exception';
import { ErrorMessage } from '@web/shared/lib/ui/components/error/Error';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';

const PlayButton = styled(Button)`
	position: initial;
	right: 10px;
	&&& {
		margin-bottom: 20px;
	}

	@media ${device.laptop} {
		position: absolute;
	}
`;

interface IProps {
	players: PlayerDto[];
	renewContract: () => void;
}

interface IProps {
	profilePlayers: IProfilePlayers;
	user: IUser;
	weeklyFixtures: Record<number, FixtureDto>;
	leagueId: number;
	fetchMyPlayers: typeof fetchMyPlayers;
	fetchWeeklyFixturesForTeams: typeof fetchWeeklyFixturesForTeams;
}

function renderError(errorCode) {
	let errorMessage;
	switch (errorCode) {
		case NOT_PLAYING:
			errorMessage = 'League is not in play this week';
			break;
		case NOT_ENOUGH_FIXTURES:
			errorMessage = "We don't have enough players to generate your formation. Please come back next week";
			break;
		case NOT_IN_SEASON_CODE:
			errorMessage = 'Not in season';
			break;
		case NOT_IN_WEEKDAY:
			errorMessage = 'You cant play during the weekends. Please come back next week';
			break;
	}
	return <ErrorMessage message={errorMessage} />;
}

const SwMyManagedPlayersComponent: React.FC<IProps> = ({
	profilePlayers,
	leagueId,
	fetchMyPlayers,
	fetchWeeklyFixturesForTeams,
	weeklyFixtures,
}) => {
	const user = useUser();
	const [isSettingFormation, setIsSettingFormation] = useState(false);
	const container = useContext(ContainerContext);
	useEffect(() => {
		fetchMyPlayers({ leagueId, userId: user.id });
	}, [fetchMyPlayers, leagueId, user.id]);

	useEffect(() => {
		(async () => {
			if (!get(profilePlayers, 'players.length')) {
				return;
			}
			fetchWeeklyFixturesForTeams(profilePlayers.players.map(player => player.teamId));
		})();
	}, [container, fetchWeeklyFixturesForTeams, profilePlayers]);
	const options = useFormationOptions();
	if (!profilePlayers || profilePlayers.loading) {
		return <Spinner />;
	}
	const players = profilePlayers.players;

	if (profilePlayers.errorCode) {
		return renderError(profilePlayers.errorCode);
	}

	if (!(players && players.length)) {
		return null;
	}

	return (
		<div className={'sw-relative'}>
			<PlayButton
				color={'blue'}
				onClick={() =>
					redirect({
						route: 'play-league',
						replace: true,
						params: {
							id: leagueId,
							tab: 'lineup',
						},
					})
				}
			>
				Build your lineup <Icon name={'arrow right'} />
			</PlayButton>
			<span className={'sw-mr2'}>Your favorite formation</span>
			<Select
				className={'sw-mb3'}
				disabled={isSettingFormation}
				defaultValue={profilePlayers.preference.formation}
				options={options}
				onChange={(e, { value }) => setPreferredFormation(value)}
			/>
			<Grid verticalAlign={'middle'} centered>
				{players.length > 0 ? (
					players.map(player => (
						<SwPlayerStatCard
							player={player}
							weeklyFixture={weeklyFixtures[player.teamId]}
							key={player.id}
						/>
					))
				) : (
					<span />
				)}
			</Grid>
		</div>
	);

	async function setPreferredFormation(value) {
		const leagueService = container.get(UserLeagueService);

		try {
			setIsSettingFormation(true);
			await leagueService.setPreferredFormation({ formation: value, leagueId, userId: user.id });
		} finally {
			setIsSettingFormation(false);
		}
	}
};
const enhancer = compose(
	registerReducer({
		profilePlayers: profilePlayersReducer,
		fixtures: {
			unmount: false,
			reducer: fixtureReducer,
		},
	}),
	registerEpic(fetchMyPlayersEpic, fetchWeeklyFixtureForTeamsEpic),
	connect(
		(state, ownProps) => {
			const userId = safeGet(() => state.auth.user.id);
			return {
				profilePlayers: safeGet(() => state.profilePlayers[userId][ownProps.leagueId]),
				weeklyFixtures: state.fixtures.weekly,
			};
		},
		{
			fetchMyPlayers,
			fetchWeeklyFixturesForTeams,
		}
	)
);

export const SwMyManagedPlayers = enhancer(SwMyManagedPlayersComponent);
