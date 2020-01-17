import React from 'react';
import { List } from 'semantic-ui-react';
import { UserPlayerDto } from '@shared/lib/dtos/player/player.dto';
import { SwPlayerItem } from '@web/features/lineup/components/players/PlayerItem';
import { LineupContainer } from './Lineup.styled';

interface IProps {
	players: UserPlayerDto[];
	readonly: boolean;
}

const SwLineupBuilder: React.FC<IProps> = function({ players = [], readonly }) {
	return (
		<div>
			<LineupContainer>
				<List divided={true}>
					{players.map(player => (
						<SwPlayerItem key={player.name} readonly={readonly} player={player} />
					))}
				</List>
			</LineupContainer>
		</div>
	);
};

export const SwLineup = SwLineupBuilder;
