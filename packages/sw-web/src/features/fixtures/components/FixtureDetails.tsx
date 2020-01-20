import React from 'react';
import { FixtureDetailsDto, FixtureDto, FixturePlayerRatingDto } from '@shared/lib/dtos/fixture/fixture.dto';
import { formatRelative } from 'date-fns';
import { fifaFlag, fifaImage } from '@web/shared/lib/images/links';
import { Divider, Header, Image, Popup, Table } from 'semantic-ui-react';
import { IconName, SwIcon } from '@web/shared/lib/icon';
import { TeamDto } from '@shared/lib/dtos/team/team.dto';
import * as S from './FixtureDetails.styled';

interface IProps {
	fixtureDetails: FixtureDetailsDto;
}

function fixtureHeader(fixtureDetails: FixtureDetailsDto) {
	const fixture = fixtureDetails.fixture;
	return (
		<div className={'sw-p1'}>
			<div className={'sw-flex sw-flex-justify'}>
				<div>
					<span>{fixture.league.title} </span>
					&middot;
					<span> {formatRelative(new Date(fixture.time), new Date())}</span>
				</div>
				<div>{renderStatus(fixture)}</div>
			</div>
			<div className={'sw-flex sw-flex-justify-center sw-mt4 sw-mb3 sw-align-center'}>
				<div>
					<div className={'sw-flex'}>
						<div className={'sw-flex sw-flex-grow-equal sw-ml2'}>
							<div className={'sw-mr4'}>
								<img src={fifaImage(fixture.homeTeam.image)} alt={fixture.homeTeam.title} />
								<div>{fixture.homeTeam.title}</div>
							</div>
							<S.FixtureScore>{fixture.homeScore}</S.FixtureScore>
						</div>
						<S.FixtureScore className={'sw-ml2 sw-mr2'}>-</S.FixtureScore>
						<div className={'sw-flex sw-flex-grow-equal sw-mr2'}>
							<S.FixtureScore>{fixture.awayScore}</S.FixtureScore>
							<div className={'sw-ml4'}>
								<img src={fifaImage(fixture.awayTeam.image)} alt={fixture.awayTeam.title} />
								<div>{fixture.awayTeam.title}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Divider />
			{!!(fixture.incidents && fixture.incidents.length) && (
				<>
					<div className={'sw-flex sw-flex-justify'}>
						<div className={'sw-flex-grow-equal'}>
							{renderIncidents(fixture.incidents.filter(incident => incident.home))}
						</div>
						<S.SoccerIcon name={'soccer-ball'} width={18} />
						<div className={'sw-flex-grow-equal'}>
							{renderIncidents(
								fixture.incidents.filter(incident => !incident.home),
								false
							)}
						</div>
					</div>
					<Divider />
				</>
			)}
			<Header as={'h3'}>Ratings</Header>
			{renderPlayerRatings({ team: fixture.homeTeam, ratings: fixtureDetails.ratings.home })}
			{renderPlayerRatings({ team: fixture.awayTeam, ratings: fixtureDetails.ratings.away })}
		</div>
	);
}

function renderPlayerRatings({
	team,
	ratings: ratingDetails = [],
}: {
	team: TeamDto;
	ratings: FixturePlayerRatingDto[];
}) {
	return (
		<div className={'sw-mb3 sw-mt2 sw-overflow-x'}>
			<Header as={'h5'}>{team.title}</Header>
			{!ratingDetails.length && <div className={'sw-mt2'}>No ratings available</div>}
			{!!ratingDetails.length && (
				<Table padded stackable>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Shirt</Table.HeaderCell>
							<Table.HeaderCell>Player</Table.HeaderCell>
							<Table.HeaderCell>Shots</Table.HeaderCell>
							<Table.HeaderCell>ShotsOT</Table.HeaderCell>
							<Table.HeaderCell>KeyPasses</Table.HeaderCell>
							<Table.HeaderCell>PA%</Table.HeaderCell>
							<Table.HeaderCell>Aeriels</Table.HeaderCell>
							<Table.HeaderCell>Touches</Table.HeaderCell>
							<Table.HeaderCell>Tackles</Table.HeaderCell>
							<Table.HeaderCell>Ratings</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{ratingDetails
							.sort((a, b) => a.player.shirt - b.player.shirt)
							.map(playerRating => (
								<Table.Row key={playerRating.player.id}>
									<Table.Cell>{playerRating.player.shirt}</Table.Cell>
									<Table.Cell>
										<div className={'sw-flex sw-flex-center'} style={{ width: '160px' }}>
											<Image
												src={fifaFlag(playerRating.player.nationalityId)}
												title={playerRating.player.nationality}
											/>
											<Popup
												trigger={
													<span
														className={'sw-ml1 sw-truncate'}
														data-tooltip={playerRating.player.name}
													>
														{playerRating.player.name}
													</span>
												}
												content={playerRating.player.name}
												inverted
												position="top center"
											/>
										</div>
										<Header.Subheader className={'sw-mt1 sw-text--grey-dark'}>
											{playerRating.player.age} - {playerRating.player.positions.join(', ')}
										</Header.Subheader>
									</Table.Cell>
									<Table.Cell>{playerRating.rating.shotsTotal}</Table.Cell>
									<Table.Cell>{playerRating.rating.shotsOffTarget}</Table.Cell>
									<Table.Cell>{playerRating.rating.keyPassTotal}</Table.Cell>
									<Table.Cell>{playerRating.rating.passesAccurate}</Table.Cell>
									<Table.Cell>{playerRating.rating.duelAerialWon}</Table.Cell>
									<Table.Cell>{playerRating.rating.touches}</Table.Cell>
									<Table.Cell>{playerRating.rating.tackleSuccessful}</Table.Cell>
									<Table.Cell>{playerRating.rating.rating}</Table.Cell>
								</Table.Row>
							))}
					</Table.Body>
				</Table>
			)}
		</div>
	);
}

function renderIncidents(incidents = [], isLeft = true) {
	return (
		<>
			{incidents.map((incident, index) => {
				let iconName: IconName;

				switch (incident.type) {
					case 'yellow-card':
						iconName = 'yellow-card';
						break;
					case 'red-card':
						iconName = 'red-card';
						break;
					default:
						iconName = 'soccer-ball';
						break;
				}
				return (
					<div
						key={index}
						className={`sw-flex sw-flex-center sw-mb1 ${isLeft ? '' : 'sw-flex-justify-right'}`}
					>
						<SwIcon name={iconName} width={18} className={'sw-mr1'} />
						<span className={'sw-truncate'} style={{ width: '60%', maxWidth: '150px' }}>
							{incident.info && <span>{incident.info} &nbsp;</span>}

							<Popup
								trigger={<span>{incident.player}</span>}
								content={incident.player}
								inverted
								position="top center"
							/>
						</span>
						&nbsp;
						<span>{incident.minute}&apos;</span>
					</div>
				);
			})}
		</>
	);
}

function renderStatus({ status, current }: FixtureDto) {
	if (status === 'FT') {
		return 'Full-Time';
	} else if (status === 'HT') {
		return 'Half-Time';
	} else if (status === 'PENDING') {
		return 'Pending';
	} else if (status === 'ACTIVE') {
		return `${current}'`;
	} else {
		return status;
	}
}
const SwFixtureDetailsComponent: React.FC<IProps> = ({ fixtureDetails }) => {
	return <div>{fixtureHeader(fixtureDetails)}</div>;
};

export const SwFixtureDetails = SwFixtureDetailsComponent;
