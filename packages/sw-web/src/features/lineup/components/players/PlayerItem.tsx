import React from 'react';
import { Label, List, Popup } from 'semantic-ui-react';
import { useDrag } from 'react-dnd-cjs';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { PLAYER, PLAYER_ITEM_ZONE } from '@web/features/lineup/components/item.constant';
import {
	SwDraggablePlayer,
	SwPlayerLogo,
	SwStatsLabel,
	SwTeamLogo,
} from '@web/features/lineup/components/players/PlayerItem.styled';
import { useEmptyPreviewImage } from '@web/shared/lib/react/hooks';
import { fifaImage } from '@web/shared/lib/images/links';
import { getPositionColor, getRatingColor } from '@web/shared/lib/color';

interface IProps {
	player: PlayerDto;
}

const SwPlayerItemComponent: React.FC<IProps> = ({ player }) => {
	const [{ isDragging }, drag, preview] = useDrag({
		item: { type: PLAYER, player, zone: PLAYER_ITEM_ZONE },
		isDragging: monitor => monitor.getItem().player === player,
		collect: monitor => ({ isDragging: monitor.isDragging() }),
	});

	useEmptyPreviewImage(preview);

	return (
		<List.Item>
			<List.Content>
				<SwDraggablePlayer ref={drag} isDragging={isDragging}>
					<SwPlayerLogo circular avatar src={fifaImage(player.image)} />
					<div className={'sw-flex-grow'}>
						<span>{player.name}</span>
						<div>
							{player.positions.map(position => (
								<Label as="a" key={position} color={getPositionColor(position)} size={'mini'}>
									{position}
								</Label>
							))}
						</div>
					</div>
					<div className={'sw-mr2'}>
						<SwStatsLabel circular size={'small'} color={getRatingColor(player.rating)}>
							{player.rating}
						</SwStatsLabel>
						<Popup
							trigger={
								<span>
									<SwTeamLogo avatar src={fifaImage(player.team!.image)} />
								</span>
							}
							content={player.teamName}
							inverted
							position="top center"
						/>
					</div>
				</SwDraggablePlayer>
			</List.Content>
		</List.Item>
	);
};

export const SwPlayerItem = SwPlayerItemComponent;
