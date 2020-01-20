import React, { memo } from 'react';
import { useDrop } from 'react-dnd-cjs';
import {
	PLAYER,
	PLAYER_BOX_ZONE,
	PLAYER_ITEM_ZONE,
	POSITION_BOX_ZONE,
} from '@web/features/lineup/components/item.constant';
import { noop } from '@shared/lib/utils/functions';
import { UserPlayerDto } from '@shared/lib/dtos/player/player.dto';
import { SwPositionCircle } from '@web/features/lineup/components/pitch/markers/PositionBox.styled';

interface IProps {
	position: any;
	rect: any;
	onAddPlayerToLineup?: (player: UserPlayerDto) => void;
	onSwitchLineupPosition?: (player: UserPlayerDto) => void;
}

const SwPositionBoxComponent: React.FC<IProps> = ({
	position,
	rect,
	onAddPlayerToLineup = noop,
	onSwitchLineupPosition = noop,
}) => {
	const [{ isActive, canDrop, isDragging }, drop] = useDrop({
		accept: PLAYER,
		collect: monitor => ({
			isActive: monitor.canDrop() && monitor.isOver(),
			canDrop: monitor.canDrop(),
			isDragging: !!monitor.getItem(),
			zone: POSITION_BOX_ZONE,
		}),
		drop: item => {
			if (item.zone === PLAYER_ITEM_ZONE) {
				onAddPlayerToLineup(item.player);
			} else if (item.zone === PLAYER_BOX_ZONE) {
				onSwitchLineupPosition(item.player);
			}
			return {
				source: item.player,
				dest: null,
				zone: POSITION_BOX_ZONE,
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
