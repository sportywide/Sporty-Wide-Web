import React from 'react';
import { SwLeagueImage, SwLeagueTitle, SwLeagueWrapper } from '@web/features/leagues/base/components/League.styled';
import { SelectableLeagueDto } from '@shared/lib/dtos/leagues/user-league.dto';
import { Icon } from 'semantic-ui-react';

interface IProps {
	league: SelectableLeagueDto;
	onSelect?: (league: SelectableLeagueDto) => void;
}

const SwLeagueComponent: React.FC<IProps> = ({ league, onSelect }) => {
	return (
		<SwLeagueWrapper onClick={() => onSelect(league)}>
			<SwLeagueImage size={'small'} src={league.image} />
			<SwLeagueTitle>
				<span className={'ub-mr1'}>{league.title}</span>
				{league.selected && <Icon color={'green'} size={'small'} name={'check circle'} />}
			</SwLeagueTitle>
		</SwLeagueWrapper>
	);
};

export const SwLeague = SwLeagueComponent;
