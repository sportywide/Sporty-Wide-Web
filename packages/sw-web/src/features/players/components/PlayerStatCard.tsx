import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';
import { fifaImage } from '@web/shared/lib/images/links';
import { formatDistance } from 'date-fns';
import { SwIcon } from '@web/shared/lib/icon';
import { getPositionColor, getRatingColor } from '@web/shared/lib/color';
import React from 'react';
import { Card, GridColumn, Image, Label, Popup } from 'semantic-ui-react';

interface IProps {
	player: PlayerDto;
	weeklyFixture: FixtureDto;
}

const SwPlayerStatCardComponent: React.FC<IProps> = ({ player, weeklyFixture }) => {
	const isHomeTeam = weeklyFixture && weeklyFixture.homeId === player.teamId;
	const againstTeam = weeklyFixture && (isHomeTeam ? weeklyFixture.away : weeklyFixture.home);
	const isPastGame = weeklyFixture && weeklyFixture.time.getTime() < new Date().getTime();
	return (
		<GridColumn mobile={16} tablet={8} computer={4}>
			<Card key={player.id}>
				<Card.Content style={{ height: '265px' }}>
					<Image floated="right" size="tiny" src={fifaImage(player.image)} />
					<Card.Header>
						<Popup
							trigger={<div className={'sw-truncate'}>{player.name}</div>}
							content={player.name}
							position="top center"
						/>
					</Card.Header>
					<Card.Meta>
						<div>{player.teamName}</div>
						<div>{player.age} years old</div>
					</Card.Meta>
					<Card.Description>
						<div>
							<strong>Stats:</strong>
							<div className={'sw-flex sw-flex-center sw-flex-justify sw-mt1 sw-flex-wrap'}>
								<div className={'sw-flex sw-flex-center sw-mb1'}>
									<SwIcon name={'foot-ware'} width={18} className={'sw-mr1'} />{' '}
									{player.stats?.played ?? 'N/A'}
								</div>
								<div className={'sw-flex sw-flex-center sw-mb1'}>
									<SwIcon name={'soccer-ball'} width={18} className={'sw-mr1'} />{' '}
									{player.stats?.scored ?? 'N/A'}
								</div>
								<div className={'sw-flex sw-flex-center sw-mb1'}>
									<SwIcon name={'red-card'} width={18} className={'sw-mr1'} />{' '}
									{player.stats?.red ?? 'N/A'}
								</div>
								<div className={'sw-flex sw-flex-center sw-mb1'}>
									<SwIcon name={'yellow-card'} width={18} className={'sw-mr1'} />{' '}
									{player.stats?.yellow ?? 'N/A'}
								</div>
							</div>
						</div>
						<div className={'sw-mt2'}>
							{weeklyFixture && (
								<>
									<strong>{isPastGame ? 'Past' : 'Upcoming'} game:</strong>
									<div className={'sw-flex sw-flex-center sw-flex-justify sw-mt1'}>
										<span>
											<strong>{isHomeTeam ? 'H - ' : 'A - '}</strong>
											{againstTeam} - {formatDistance(weeklyFixture.time, new Date())}{' '}
											{isPastGame ? 'ago' : ''}
											{isPastGame
												? ` (${weeklyFixture.homeScore} - ${weeklyFixture.awayScore})`
												: ''}
										</span>
									</div>
								</>
							)}
						</div>
					</Card.Description>
				</Card.Content>
				<Card.Content extra>
					<div className={'sw-flex sw-flex-center sw-flex-justify'}>
						<div>{player.positions.map(playerPosition)}</div>
						<span>
							<Label circular size={'small'} color={getRatingColor(player.rating)}>
								{player.rating}
							</Label>
						</span>
					</div>
				</Card.Content>
			</Card>
		</GridColumn>
	);
};

const playerPosition = (position: string) => {
	return (
		<Label as="a" key={position} color={getPositionColor(position)} size={'mini'}>
			{position}
		</Label>
	);
};

export const SwPlayerStatCard = SwPlayerStatCardComponent;
