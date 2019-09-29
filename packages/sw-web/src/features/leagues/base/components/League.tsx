import React from 'react';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { SwLeagueImage, SwLeagueTitle } from '@web/features/leagues/base/components/League.styled';

interface IProps {
	league: LeagueDto;
}

const SwLeagueComponent: React.FC<IProps> = ({ league }) => {
	return (
		<>
			<SwLeagueImage size={'small'} src={league.image} />
			<SwLeagueTitle>{league.title}</SwLeagueTitle>
		</>
	);
};

export const SwLeague = SwLeagueComponent;
