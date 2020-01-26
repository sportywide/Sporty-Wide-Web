import React from 'react';
import { SwPlayerDraggingLogo } from '@web/features/lineup/components/players/PlayerItem.styled';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { playerFifaImage } from '@web/shared/lib/images/links';

interface IProps {
	player: PlayerDto;
}

const SwPlayerPreviewComponent: React.FC<IProps> = ({ player }) => {
	return (
		<SwPlayerDraggingLogo
			circular
			avatar
			src={playerFifaImage(player.image)}
			style={{ transform: 'translate(-50%, -50%)' }}
		/>
	);
};

export const SwPlayerPreview = SwPlayerPreviewComponent;
