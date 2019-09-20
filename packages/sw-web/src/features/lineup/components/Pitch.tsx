import React, { useState } from 'react';
import Measure from 'react-measure';
import { useDrop } from 'react-dnd-cjs';
import { PLAYER } from '@web/features/lineup/components/item.constant';
import { FormationDto } from '@shared/lib/dtos/formation/formation.dto';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { SwStyledPitch, SwStyledPitchBackground } from '@web/features/lineup/components/pitch.styled';
import { SwPositionBox } from './PositionBox';
import { SwPlayerBox } from './PlayerBox';

interface IProps {
	strategy: FormationDto;
	positions: (PlayerDto | null)[];
	onAddPlayerToLineup?: (player: PlayerDto, index: number) => void;
	onSwapPlayers?: (source: PlayerDto, dest: PlayerDto) => void;
	onRemovePlayerFromLineup?: (player: PlayerDto, index: number) => void;
	onClearPlayerPosition?: (index: number) => void;
}

const SwPitchComponent: React.FC<IProps> = function({
	strategy: { formation },
	positions,
	onAddPlayerToLineup,
	onSwapPlayers,
	onRemovePlayerFromLineup,
	onClearPlayerPosition,
}) {
	const [rect, setRect] = useState<any>({});
	const [, drop] = useDrop({
		accept: PLAYER,
		canDrop: () => true,
		drop: (item, monitor) => {
			const dropResult = monitor.getDropResult() || {};
			return { ...dropResult, element: SwPitch };
		},
	});

	return (
		<SwStyledPitch ref={drop}>
			<div className={'ub-relative'}>
				<Measure
					onResize={contentRef => {
						setRect(contentRef.entry || {});
					}}
				>
					{({ measureRef }) => (
						<SwStyledPitchBackground ref={measureRef} src={'/static/pitch.svg'} alt="Pitch outlines" />
					)}
				</Measure>
				{rect &&
					formation.map((position, index) =>
						positions[index] ? (
							<SwPlayerBox
								rect={rect}
								player={positions[index]}
								position={position}
								key={index}
								onRemovePlayerFromLineup={player => onRemovePlayerFromLineup(player, index)}
								onSwapPlayers={(source, dest) => onSwapPlayers(source, dest)}
								onChangePlayerPosition={() => onClearPlayerPosition(index)}
							/>
						) : (
							<SwPositionBox
								rect={rect}
								position={position}
								key={index}
								onAddPlayerToLineup={player => onAddPlayerToLineup(player, index)}
							/>
						)
					)}
			</div>
		</SwStyledPitch>
	);
};

export const SwPitch = SwPitchComponent;
