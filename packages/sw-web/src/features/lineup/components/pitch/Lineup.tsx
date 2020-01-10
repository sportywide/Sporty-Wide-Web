import React from 'react';
import { List } from 'semantic-ui-react';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { SwPlayerItem } from '@web/features/lineup/components/players/PlayerItem';
import { LineupContainer } from './Lineup.styled';

interface IProps {
	players: PlayerDto[];
}

const SwLineupBuilder: React.FC<IProps> = function({ players = [] }) {
	return (
		<div>
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
