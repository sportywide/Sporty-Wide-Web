import React from 'react';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { SwLeagueImage, SwLeagueTitle, SwLeagueWrapper } from '@web/features/leagues/base/components/League.styled';

interface IProps {
	league: LeagueDto;
	onSelect?: () => void;
}

const SwLeagueComponent: React.FC<IProps> = ({ league, onSelect }) => {
	return (
		<SwLeagueWrapper onClick={() => onSelect()}>
			<SwLeagueImage size={'small'} src={league.image} />
			<SwLeagueTitle>{league.title}</SwLeagueTitle>
		</SwLeagueWrapper>
	);
};

export const SwLeague = SwLeagueComponent;
