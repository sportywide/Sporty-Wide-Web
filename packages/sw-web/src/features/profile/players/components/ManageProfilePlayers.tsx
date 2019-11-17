import React, { useEffect } from 'react';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { fifaImage } from '@web/shared/lib/images/links';
import { Card, Image, Button, Loader } from 'semantic-ui-react';
import { IProfilePlayers, profilePlayersReducer } from '@web/features/profile/players/store/reducers';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { fetchProfilePlayersEpic } from '@web/features/profile/players/store/epics';
import { fetchProfilePlayers } from '@web/features/profile/players/store/actions';
import { compose } from '@shared/lib/utils/fp/combine';
import { connect } from 'react-redux';

import { useUser } from '@web/shared/lib/react/hooks';
import { safeGet } from '@shared/lib/utils/object/get';

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
		<Button key={position} size="mini">
			{position}
		</Button>
	);
};

const playerCard = (player: PlayerDto) => {
	return (
		<Card key={player.id}>
			<Card.Content>
				<Image floated="right" size="tiny" src={fifaImage(player.image)} />
				<Card.Header>{player.name}</Card.Header>
				<Card.Meta>{player.teamName}</Card.Meta>
				<Card.Description>
					<strong>Age:</strong> {player.age}
					<br />
					<strong>Rating:</strong> {player.rating}
					<br />
					<strong>Positions:</strong> <div>{player.positions.map(playerPosition)}</div>
				</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<div className="ui two buttons">
					<Button basic color="green">
						Renew
					</Button>
					<Button basic color="red">
						Sell
					</Button>
				</div>
			</Card.Content>
		</Card>
	);
};

const SwManageProfilePlayersComponent: React.FC<IProps> = ({ profilePlayers, leagueId, fetchProfilePlayers }) => {
	const user = useUser();
	useEffect(() => {
		fetchProfilePlayers({ leagueId, userId: user.id });
	}, [fetchProfilePlayers, leagueId, user.id]);

	if (!profilePlayers || profilePlayers.loading) {
		return <Loader />;
	}
	const players = profilePlayers.players;
	return (
		<div className={'sw-mt4'}>
			<Card.Group>{players.length > 0 ? players.map(playerCard) : <span />}</Card.Group>
		</div>
	);
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
