import React from 'react';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { fifaImage } from '@web/shared/lib/images/links';
import { Card, Image, Button } from 'semantic-ui-react';

interface IProps {
	players: PlayerDto[];
	renewContract: () => void;
}

const playerPosition = (position: string) => {
	return (
		<Button key={position} size="mini">{position}</Button>
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
					<strong>Age:</strong> {player.age}<br/>
					<strong>Rating:</strong> {player.rating}<br/>
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

const SwManageProfilePlayersComponent: React.FC<IProps> = ({ players, renewContract }) => {
	console.log(players);
	return (
		<div className={'sw-mt4'}>
			<Card.Group>
				{players.length > 0 ? players.map(playerCard) : <span></span>}
			</Card.Group>
		</div>
	);
};
export const SwManageProfilePlayers = SwManageProfilePlayersComponent;
