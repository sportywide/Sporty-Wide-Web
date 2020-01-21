import React from 'react';
import { Label, List, Popup } from 'semantic-ui-react';
import { useDrag } from 'react-dnd-cjs';
import { UserPlayerDto } from '@shared/lib/dtos/player/player.dto';
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
	player: UserPlayerDto;
	readonly: boolean;
}

const SwPlayerItemComponent: React.FC<IProps> = ({ player, readonly }) => {
	const canDrag = player.available && !readonly;
	const [{ isDragging }, drag, preview] = useDrag({
		item: { type: PLAYER, player, zone: PLAYER_ITEM_ZONE },
		isDragging: monitor => monitor.getItem().player === player,
		canDrag: () => canDrag,
		collect: monitor => ({ isDragging: monitor.isDragging() }),
	});

	useEmptyPreviewImage(preview);

	return (
		<List.Item>
			<List.Content>
				<SwDraggablePlayer ref={drag} isDragging={isDragging} canDrag={canDrag} available={player.available}>
					<SwPlayerLogo circular avatar src={fifaImage(player.image)} />
					<div className={'sw-flex-grow-equal sw-truncate sw-mr1'}>
						{player.available ? (
							<span>
								{player.shirt}. {player.name}
							</span>
						) : (
							<Popup
								trigger={
									<span>
										{player.shirt}. {player.name}
									</span>
								}
								content={'Player has already played'}
								inverted
								position="top center"
							/>
						)}
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
