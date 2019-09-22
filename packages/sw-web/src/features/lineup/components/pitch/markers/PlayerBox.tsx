import React from 'react';
import { useDrag, useDrop } from 'react-dnd-cjs';
import { PLAYER, PLAYER_BOX_ZONE, PLAYER_ITEM_ZONE } from '@web/features/lineup/components/item.constant';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { PositionDto } from '@shared/lib/dtos/formation/formation.dto';
import {
	SwPlayerCircle,
	SwPlayerCircleAvatar,
	SwPlayerCircleName,
} from '@web/features/lineup/components/pitch/markers/player-circle.styled';

interface IProps {
	rect: any;
	player: PlayerDto;
	position: PositionDto;
	onSwapPlayers?: (source: PlayerDto, dest: PlayerDto) => void;
	onSubstitutePlayer?: (source: PlayerDto, dest: PlayerDto) => void;
	onRemovePlayerFromLineup?: (player: PlayerDto) => void;
}

const SwPlayerBoxComponent: React.FC<IProps> = ({
	player,
	position,
	rect,
	onSwapPlayers,
	onRemovePlayerFromLineup,
	onSubstitutePlayer,
}) => {
	const [{ isDragging }, drag] = useDrag({
		item: { type: PLAYER, player, position, zone: PLAYER_BOX_ZONE },
		isDragging: monitor => {
			return monitor.getItem().player === player;
		},
		collect: monitor => ({ isDragging: monitor.isDragging() }),
		end: (item, monitor) => {
			if (!monitor.didDrop()) {
				onRemovePlayerFromLineup(player);
			}
		},
	});

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
			isDragging={isDragging}
			style={{
				left: rect.width * (position.left / 100),
				top: rect.height * (position.top / 100),
			}}
		>
			<SwPlayerCircleAvatar avatar src={player.image} />
			<SwPlayerCircleName>{player.name}</SwPlayerCircleName>
		</SwPlayerCircle>
	);
};

export const SwPlayerBox = SwPlayerBoxComponent;
