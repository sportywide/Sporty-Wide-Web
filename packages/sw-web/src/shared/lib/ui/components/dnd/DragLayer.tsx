import React from 'react';
import { useDragLayer, XYCoord } from 'react-dnd-cjs';
import { PLAYER } from '@web/features/lineup/components/item.constant';
import { SwPlayerPreview } from '@web/features/lineup/components/players/PlayerPreview';

const layerStyles: React.CSSProperties = {
	position: 'fixed',
	pointerEvents: 'none',
	zIndex: 100,
	left: 0,
	top: 0,
	width: '100%',
	height: '100%',
};

function getItemStyles(currentOffset: XYCoord | null) {
	if (!currentOffset) {
		return {
			display: 'none',
		};
	}

	const { x, y } = currentOffset;

	const transform = `translate(${x}px, ${y}px)`;
	return {
		transform,
		WebkitTransform: transform,
	};
}

const SwDragLayerComponent: React.FC<any> = () => {
	const { itemType, isDragging, item, currentOffset } = useDragLayer(monitor => ({
		item: monitor.getItem(),
		itemType: monitor.getItemType(),
		initialSourceOffset: monitor.getInitialSourceClientOffset(),
		currentSourceOffset: monitor.getSourceClientOffset(),
		initialOffset: monitor.getInitialClientOffset(),
		currentOffset: monitor.getClientOffset(),
		isDragging: monitor.isDragging(),
	}));

	function renderItem() {
		switch (itemType) {
			case PLAYER:
				return <SwPlayerPreview player={item.player} />;
			default:
				return null;
		}
	}

	if (!isDragging) {
		return null;
	}
	return (
		<div style={layerStyles}>
			<div style={getItemStyles(currentOffset)}>{renderItem()}</div>
		</div>
	);
};
export const SwDragLayer = SwDragLayerComponent;
