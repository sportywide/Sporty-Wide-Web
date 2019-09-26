import React, { useEffect } from 'react';
import { Label, List } from 'semantic-ui-react';
import { useDrag } from 'react-dnd-cjs';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { PLAYER, PLAYER_ITEM_ZONE } from '@web/features/lineup/components/item.constant';
import {
	SwDraggablePlayer,
	SwPlayerLogo,
	SwStatsLabel,
	SwTeamLogo,
} from '@web/features/lineup/components/players/player-item.styled';

interface IProps {
	player: PlayerDto;
}

const SwPlayerItemComponent: React.FC<IProps> = ({ player }) => {
	const [{ isDragging }, drag, preview] = useDrag({
		item: { type: PLAYER, player, zone: PLAYER_ITEM_ZONE },
		isDragging: monitor => monitor.getItem().player === player,
		collect: monitor => ({ isDragging: monitor.isDragging(), dropResult: monitor.getDropResult() }),
	});

	useEffect(() => {
		const img = new Image();
		img.src = player.image;
		img.onload = () => {
			const ctx = document.createElement('canvas').getContext('2d');
			ctx.canvas.width = 50;
			ctx.canvas.height = 50;
			img.style.opacity = '1';

			ctx.drawImage(img, 0, 0, img.width, img.height);
			preview(ctx.canvas);
		};
	}, [player.image, preview]);

	return (
		<List.Item>
			<List.Content>
				<SwDraggablePlayer ref={drag} isDragging={isDragging}>
					<div>
						<SwPlayerLogo circular avatar src={player.image} />
					</div>
					<div className={'ub-flex-grow'}>
						<span>
							{player.shirt}. {player.name}
						</span>
						<div>
							{player.positions.map(position => (
								<Label as="a" key={position} color={getPositionColor(position)} size={'mini'}>
									{position}
								</Label>
							))}
						</div>
					</div>
					<div className={'ub-mr2'}>
						<SwStatsLabel circular size={'small'} color={getRatingColor(player.rating)}>
							{player.rating}
						</SwStatsLabel>
						<SwTeamLogo avatar src={player.team!.image} />
					</div>
				</SwDraggablePlayer>
			</List.Content>
		</List.Item>
	);
};

export const SwPlayerItem = SwPlayerItemComponent;

function getRatingColor(rating: number): any {
	if (rating >= 90) {
		return 'red';
	} else if (80 <= rating && rating < 90) {
		return 'blue';
	} else if (70 <= rating && rating < 80) {
		return 'green';
	}
	return 'yellow';
}
function getPositionColor(position: string): any {
	const map: { [name: string]: string } = {
		GK: 'red',
		CM: 'green',
		LM: 'green',
		RM: 'green',
		ST: 'blue',
	};
	return map[position] || 'blue';
}
