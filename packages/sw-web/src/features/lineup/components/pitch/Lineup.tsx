import React from 'react';
import { Header, List } from 'semantic-ui-react';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { LineupContainer } from '@web/features/lineup/components/pitch/lineup.styled';
import { SwPlayerItem } from '@web/features/lineup/components/players/PlayerItem';

interface IProps {
	players: PlayerDto[];
}

const SwLineupBuilder: React.FC<IProps> = function({ players }) {
	return (
		<div>
			<Header as={'h2'}>Manchester United</Header>
			<LineupContainer>
				<List divided={true}>
					{players.map(player => (
						<SwPlayerItem key={player.name} player={player} />
					))}
				</List>
			</LineupContainer>
		</div>
	);
};

export const SwLineup = SwLineupBuilder;
