import React, { memo } from 'react';
import { useDrop } from 'react-dnd-cjs';
import { PLAYER } from '@web/features/lineup/components/item.constant';
import { noop } from '@shared/lib/utils/functions';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { SwPositionCircle } from '@web/features/lineup/components/position-circle.styled';

interface IProps {
	position: any;
	rect: any;
	onAddPlayerToLineup?: (player: PlayerDto) => void;
}

const SwPositionBoxComponent: React.FC<IProps> = ({ position, rect, onAddPlayerToLineup = noop }) => {
	const [{ isActive, canDrop, isDragging }, drop] = useDrop({
		accept: PLAYER,
		collect: monitor => ({
			isActive: monitor.canDrop() && monitor.isOver(),
			canDrop: monitor.canDrop(),
			isDragging: !!monitor.getItem(),
		}),
		drop: item => {
			onAddPlayerToLineup(item.player);
			return {
				source: item.player,
				dest: null,
				element: SwPositionBox,
			};
		},
		canDrop: (item: any) => item.player.positions.includes(position.name),
	});
	if (!rect.width) {
		return null;
	}
	return (
		<SwPositionCircle
			ref={drop}
			droppable={canDrop}
			active={isActive}
			disabled={isDragging && !canDrop}
			style={{
				left: rect.width * (position.left / 100),
				top: rect.height * (position.top / 100),
			}}
		/>
	);
};

export const SwPositionBox = memo(SwPositionBoxComponent);
