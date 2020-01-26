import React from 'react';
import { useDrag, useDrop } from 'react-dnd-cjs';
import { PLAYER, PLAYER_BOX_ZONE, PLAYER_ITEM_ZONE } from '@web/features/lineup/components/item.constant';
import { getShortName, UserPlayerDto } from '@shared/lib/dtos/player/player.dto';
import { PositionDto } from '@shared/lib/dtos/formation/formation.dto';
import {
	SwPlayerCircle,
	SwPlayerCircleAvatar,
	SwPlayerCircleName,
} from '@web/features/lineup/components/pitch/markers/PlayeCircle.styled';
import { useEmptyPreviewImage } from '@web/shared/lib/react/hooks';
import { playerFifaImage } from '@web/shared/lib/images/links';

interface IProps {
	rect: any;
	player: UserPlayerDto;
	position: PositionDto;
	onSwapPlayers?: (source: UserPlayerDto, dest: UserPlayerDto) => void;
	onSubstitutePlayer?: (source: UserPlayerDto, dest: UserPlayerDto) => void;
	onRemovePlayerFromLineup?: (player: UserPlayerDto) => void;
	readonly: boolean;
}

const SwPlayerBoxComponent: React.FC<IProps> = ({
	player,
	position,
	rect,
	onSwapPlayers,
	onRemovePlayerFromLineup,
	onSubstitutePlayer,
	readonly,
}) => {
	const [{ isDragging }, drag, preview] = useDrag({
		item: { type: PLAYER, player, position, zone: PLAYER_BOX_ZONE },
		isDragging: monitor => {
			return monitor.getItem().player === player;
		},
		canDrag: !readonly,
		collect: monitor => ({ isDragging: monitor.isDragging() }),
		end: (item, monitor) => {
			if (!monitor.didDrop()) {
				onRemovePlayerFromLineup(player);
			}
		},
	});

	useEmptyPreviewImage(preview);

	const [, drop] = useDrop({
		accept: PLAYER,
		drop: item => {
			if (item.zone === PLAYER_BOX_ZONE) {
				onSwapPlayers(item.player, player);
			} else if (item.zone === PLAYER_ITEM_ZONE) {
				onSubstitutePlayer(item.player, player);
			}

			return {
				source: item.player,
				dest: player,
				zone: PLAYER_BOX_ZONE,
			};
		},
		canDrop: (item: any) =>
			(!item.position || player.positions.includes(item.position.name)) &&
			item.player.positions.includes(position.name),
	});

	const connectedRef = node => {
		drag(node);
		drop(node);
	};

	return (
		<SwPlayerCircle
			ref={connectedRef}
			canDrag={!readonly}
			style={{
				left: rect.width * (position.left / 100),
				top: rect.height * (position.top / 100),
			}}
			isDragging={isDragging}
		>
			<SwPlayerCircleAvatar avatar src={playerFifaImage(player.image)} />
			<SwPlayerCircleName className={'sw-truncate'}>{getShortName(player.name)}</SwPlayerCircleName>
		</SwPlayerCircle>
	);
};

export const SwPlayerBox = SwPlayerBoxComponent;
