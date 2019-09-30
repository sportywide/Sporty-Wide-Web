import React, { useState } from 'react';
import Measure from 'react-measure';
import { useDrop } from 'react-dnd-cjs';
import { PLAYER } from '@web/features/lineup/components/item.constant';
import { FormationDto } from '@shared/lib/dtos/formation/formation.dto';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { SwStyledPitch, SwStyledPitchBackground } from '@web/features/lineup/components/pitch/Pitch.styled';
import { SwPositionBox } from './markers/PositionBox';
import { SwPlayerBox } from './markers/PlayerBox';

interface IProps {
	strategy: FormationDto;
	positions: (PlayerDto | null)[];
	onAddPlayerToLineup?: (player: PlayerDto, index: number) => void;
	onSwapPlayers?: (source: PlayerDto, dest: PlayerDto) => void;
	onSubstitutePlayer?: (source: PlayerDto, dest: PlayerDto) => void;
	onRemovePlayerFromLineup?: (player: PlayerDto, index: number) => void;
	onSwitchLineupPosition?: (player: PlayerDto, index: number) => void;
}

const SwPitchComponent: React.FC<IProps> = function({
	strategy: { formation },
	positions,
	onAddPlayerToLineup,
	onSwapPlayers,
	onRemovePlayerFromLineup,
	onSwitchLineupPosition,
	onSubstitutePlayer,
}) {
	const [rect, setRect] = useState<any>({});
	const [, drop] = useDrop({
		accept: PLAYER,
		canDrop: () => true,
		drop: (item, monitor) => {
			const dropResult = monitor.getDropResult() || {};
			return { ...dropResult };
		},
	});

	return (
		<SwStyledPitch ref={drop}>
			<div className={'sw-relative'}>
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
								onSubstitutePlayer={(source, dest) => onSubstitutePlayer(source, dest)}
								onRemovePlayerFromLineup={player => onRemovePlayerFromLineup(player, index)}
								onSwapPlayers={(source, dest) => onSwapPlayers(source, dest)}
							/>
						) : (
							<SwPositionBox
								rect={rect}
								position={position}
								key={index}
								onAddPlayerToLineup={player => onAddPlayerToLineup(player, index)}
								onSwitchLineupPosition={player => onSwitchLineupPosition(player, index)}
							/>
						)
					)}
			</div>
		</SwStyledPitch>
	);
};

export const SwPitch = SwPitchComponent;
