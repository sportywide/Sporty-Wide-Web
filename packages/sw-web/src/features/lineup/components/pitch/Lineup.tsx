import React from 'react';
import { Dimmer, List, Loader } from 'semantic-ui-react';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { LineupContainer } from '@web/features/lineup/components/pitch/Lineup.styled';
import { SwPlayerItem } from '@web/features/lineup/components/players/PlayerItem';

interface IProps {
	players: PlayerDto[];
}

const SwLineupBuilder: React.FC<IProps> = function({ players }) {
	if (players === undefined) {
		return (
			<Dimmer active inverted>
				<Loader active />
			</Dimmer>
		);
	}
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
