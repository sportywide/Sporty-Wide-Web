import React, { useContext, useEffect, useState } from 'react';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { fifaImage } from '@web/shared/lib/images/links';
import { Card, Grid, GridColumn, Image, Label, Loader, Popup, Select } from 'semantic-ui-react';
import { IProfilePlayers, profilePlayersReducer } from '@web/features/profile/players/store/reducers';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { fetchProfilePlayersEpic } from '@web/features/profile/players/store/epics';
import { fetchProfilePlayers } from '@web/features/profile/players/store/actions';
import { compose } from '@shared/lib/utils/fp/combine';
import { connect } from 'react-redux';
import { useFormationOptions, useUser } from '@web/shared/lib/react/hooks';
import { safeGet } from '@shared/lib/utils/object/get';
import { ContainerContext } from '@web/shared/lib/store';
import { UserLeagueService } from '@web/features/leagues/user/services/user-league.service';
import { SwIcon } from '@web/shared/lib/icon';
import { getPositionColor, getRatingColor } from '@web/shared/lib/color';

interface IProps {
	players: PlayerDto[];
	renewContract: () => void;
}

interface IProps {
	profilePlayers: IProfilePlayers;
	user: IUser;
	leagueId: number;
	fetchProfilePlayers: typeof fetchProfilePlayers;
}
const playerPosition = (position: string) => {
	return (
		<Label as="a" key={position} color={getPositionColor(position)} size={'mini'}>
			{position}
		</Label>
	);
};

const playerCard = (player: PlayerDto) => {
	return (
		<GridColumn mobile={16} tablet={8} computer={4} key={player.id}>
			<Card key={player.id}>
				<Card.Content style={{ height: '180px' }}>
					<Image floated="right" size="tiny" src={fifaImage(player.image)} />
					<Card.Header>
						<Popup
							trigger={<div className={'sw-truncate'}>{player.name}</div>}
							content={player.name}
							position="top center"
						/>
					</Card.Header>
					<Card.Meta>
						<div>{player.teamName}</div>
						<div>{player.age} years old</div>
					</Card.Meta>
					<Card.Description>
						<div>
							{player.stats && (
								<>
									<strong>Stats:</strong>
									<div className={'sw-flex sw-flex-center sw-flex-justify sw-mt1'}>
										<div className={'sw-flex sw-flex-center'}>
											<SwIcon name={'foot-ware'} width={18} className={'sw-mr1'} />{' '}
											{player.stats.played}
										</div>
										<div className={'sw-flex sw-flex-center'}>
											<SwIcon name={'soccer-ball'} width={18} className={'sw-mr1'} />{' '}
											{player.stats.scored}
										</div>
										<div className={'sw-flex sw-flex-center'}>
											<SwIcon name={'red-card'} width={18} className={'sw-mr1'} />{' '}
											{player.stats.red}
										</div>
										<div className={'sw-flex sw-flex-center'}>
											<SwIcon name={'yellow-card'} width={18} className={'sw-mr1'} />{' '}
											{player.stats.yellow}
										</div>
									</div>
								</>
							)}
						</div>
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
					<div className={'sw-flex sw-flex-center sw-flex-justify'}>
						<div>{player.positions.map(playerPosition)}</div>
						<span>
							<Label circular size={'small'} color={getRatingColor(player.rating)}>
								{player.rating}
							</Label>
						</span>
					</div>
				</Card.Content>
			</Card>
		</GridColumn>
	);
};

const SwManageProfilePlayersComponent: React.FC<IProps> = ({ profilePlayers, leagueId, fetchProfilePlayers }) => {
	const user = useUser();
	const [isSettingFormation, setIsSettingFormation] = useState(false);
	const container = useContext(ContainerContext);
	useEffect(() => {
		fetchProfilePlayers({ leagueId, userId: user.id });
	}, [fetchProfilePlayers, leagueId, user.id]);

	const options = useFormationOptions();
	if (!profilePlayers || profilePlayers.loading) {
		return <Loader active inline={'centered'} />;
	}
	const players = profilePlayers.players;
	return (
		<div>
			<span className={'sw-mr2'}>Your favorite formation</span>
			<Select
				className={'sw-mb2'}
				disabled={isSettingFormation}
				defaultValue={profilePlayers.preference.formation}
				options={options}
				onChange={(e, { value }) => setPreferredFormation(value)}
			/>
			<Grid verticalAlign={'middle'} centered>
				{players.length > 0 ? players.map(playerCard) : <span />}
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
	registerReducer({ profilePlayers: profilePlayersReducer }),
	registerEpic(fetchProfilePlayersEpic),
	connect(
		(state, ownProps) => {
			const userId = safeGet(() => state.auth.user.id);
			return { profilePlayers: safeGet(() => state.profilePlayers[userId][ownProps.leagueId]) };
		},
		{
			fetchProfilePlayers,
		}
	)
);

export const SwManageProfilePlayers = enhancer(SwManageProfilePlayersComponent);
