import React from 'react';
import { SelectableLeagueDto } from '@shared/lib/dtos/leagues/user-league.dto';
import { Button, Card, Icon } from 'semantic-ui-react';
import { SwLeagueImage } from '@web/features/leagues/base/components/League.styled';

interface IProps {
	league: SelectableLeagueDto;
	onPlay?: (league: SelectableLeagueDto) => void;
	onLeave?: (league: SelectableLeagueDto) => void;
}

const SwLeagueComponent: React.FC<IProps> = ({ league, onPlay, onLeave }) => {
	return (
		<Card>
			<SwLeagueImage src={league.image} wrapped ui={false} />
			<Card.Content>
				<Card.Header>
					<div className={'sw-flex sw-flex-center'}>
						<span className={'sw-mr1'}> {league.title}</span>
						{league.selected && <Icon color={'green'} size={'small'} name={'check circle'} />}
					</div>
				</Card.Header>
			</Card.Content>
			<Card.Content extra>
				<Button positive onClick={() => onPlay(league)}>
					Play
				</Button>
				{league.selected && (
					<Button negative onClick={() => onLeave(league)}>
						Leave
					</Button>
				)}
			</Card.Content>
		</Card>
	);
};

export const SwLeague = SwLeagueComponent;
