import React, { useContext, useEffect, useState } from 'react';
import { ContainerContext } from '@web/shared/lib/store';
import { FixtureService } from '@web/features/fixtures/services/fixture.service';
import { groupBy, sortBy } from 'lodash';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';
import { format, startOfDay } from 'date-fns';
import { redirect } from '@web/shared/lib/navigation/helper';
import { ErrorMessage } from '@web/shared/lib/error/Error';
import { Spinner } from '@web/shared/lib/spinner/Spinner';
import * as S from './WeekFixtures.styled';

interface IProps {
	leagueId: number;
}

const SwWeekFixturesComponent: React.FC<IProps> = ({ leagueId }) => {
	const container = useContext(ContainerContext);
	const [fixtures, setFixtures] = useState<FixtureDto[]>(undefined);
	useEffect(() => {
		(async () => {
			const fixtureService = container.get(FixtureService);
			const fixtures = await fixtureService.fetchThisWeekFixtures(leagueId).toPromise();
			setFixtures(fixtures);
		})();
	}, [container, leagueId]);

	if (!fixtures) {
		return <Spinner />;
	}
	const fixtureGroup = groupBy(fixtures, fixture => {
		return startOfDay(fixture.time).getTime();
	});
	if (!fixtures.length) {
		return <ErrorMessage message={'No fixtures found'} />;
	}
	return (
		<>
			{Object.entries(fixtureGroup)
				.sort()
				.map(([time, fixtures]) => {
					const timeGroup = new Date(+time);
					return (
						<div key={time}>
							<S.FixtureDateHeadline as={'h4'}>{format(timeGroup, 'EEEE do MMMM')}</S.FixtureDateHeadline>
							{sortBy(fixtures, 'time').map(fixture => (
								<S.FixtureLine
									key={fixture.id}
									onClick={async () => {
										await redirect({
											refresh: false,
											route: 'fixture-details',
											params: { id: fixture.id },
										});
									}}
								>
									<S.FixtureTime>{format(new Date(fixture.time), 'HH:mm')}</S.FixtureTime>
									<S.FixtureMain>
										<S.FixtureTeam className={'sw-truncate'} home>
											{fixture.home}
										</S.FixtureTeam>
										<S.FixtureScore>
											{fixture.status === 'PENDING'
												? 'VS'
												: `${fixture.homeScore} - ${fixture.awayScore}`}
										</S.FixtureScore>
										<S.FixtureTeam className={'sw-truncate'}>{fixture.away}</S.FixtureTeam>
									</S.FixtureMain>
									<S.FixtureStatus>{renderStatus(fixture)}</S.FixtureStatus>
								</S.FixtureLine>
							))}
						</div>
					);
				})}
		</>
	);
};

function renderStatus(fixture: FixtureDto) {
	if (fixture.status === 'PENDING') {
		return 'PNDG';
	} else if (fixture.status === 'ACTIVE') {
		return `${fixture.current || 0}'`;
	} else {
		return fixture.status;
	}
}
export const SwWeekFixtures = SwWeekFixturesComponent;
