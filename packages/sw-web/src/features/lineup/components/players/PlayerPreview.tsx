import React from 'react';
import { SwPlayerLogo } from '@web/features/lineup/components/players/PlayerItem.styled';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';

interface IProps {
	player: PlayerDto;
}

const SwPlayerPreviewComponent: React.FC<IProps> = ({ player }) => {
	return <SwPlayerLogo circular avatar src={player.image} style={{ transform: 'translate(-50%, -50%)' }} />;
};

export const SwPlayerPreview = SwPlayerPreviewComponent;
