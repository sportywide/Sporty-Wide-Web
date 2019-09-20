import React from 'react';
import { useDrag, useDrop } from 'react-dnd-cjs';
import { PLAYER } from '@web/features/lineup/components/item.constant';
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
	onChangePlayerPosition?: (player: PlayerDto) => void;
	onSwapPlayers?: (source: PlayerDto, dest: PlayerDto) => void;
	onRemovePlayerFromLineup?: (player: PlayerDto) => void;
}

const SwPlayerBoxComponent: React.FC<IProps> = ({
	player,
	position,
	rect,
	onChangePlayerPosition,
	onSwapPlayers,
	onRemovePlayerFromLineup,
}) => {
	const [{ isDragging }, drag] = useDrag({
		item: { type: PLAYER, player },
		isDragging: monitor => {
			return monitor.getItem().player === player;
		},
		collect: monitor => ({ isDragging: monitor.isDragging() }),
		end: (item, monitor) => {
			if (monitor.didDrop()) {
				const { source, dest } = monitor.getDropResult();
				if (!source && !dest) {
					return;
				}
				if (!dest) {
					onChangePlayerPosition(source);
				} else {
					onSwapPlayers(source, dest);
				}
			} else {
				onRemovePlayerFromLineup(player);
			}
		},
	});

	const [, drop] = useDrop({
		accept: PLAYER,
		drop: item => {
			return {
				source: item.player,
				dest: player,
				element: SwPlayerBox,
			};
		},
		canDrop: (item: any) => item.player.positions.includes(position.name),
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
