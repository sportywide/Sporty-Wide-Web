import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ContainerContext } from '@web/shared/lib/store';
import { FixtureService } from '@web/features/fixtures/services/fixture.service';
import { groupBy, sortBy } from 'lodash';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';
import { redirect } from '@web/shared/lib/navigation/helper';
import { ErrorMessage } from '@web/shared/lib/ui/components/error/Error';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';
import { addWeeks, format, startOfDay } from 'date-fns';
import { SwDateRange } from '@web/shared/lib/ui/components/date/DateRange';
import { Button, Icon } from 'semantic-ui-react';
import { useAsyncCallback } from 'react-async-hook';
import { useEffectOnce } from '@web/shared/lib/react/hooks';
import { getSeasonRange } from '@shared/lib/utils/season';
import { weekStart } from '@shared/lib/utils/date/relative';
import * as S from './FixtureList.styled';

interface IProps {
	leagueId: number;
}

const SwFixtureListComponent: React.FC<IProps> = ({ leagueId }) => {
	const container = useContext(ContainerContext);
	const [fixtures, setFixtures] = useState<FixtureDto[]>(null);

	const defaultDateRange = useMemo(() => {
		const monday = weekStart(startOfDay(new Date()));
		const nextMonday = addWeeks(monday, 1);
		return {
			start: monday,
			end: nextMonday,
		};
	}, []);

	const seasonRange = useMemo(() => {
		return getSeasonRange();
	}, []);
	const [dateRange, setDateRange] = useState(defaultDateRange);
	const fixtureFetchCallback = useCallback(
		async (start, end) => {
			const fixtureService = container.get(FixtureService);
			const fixtures = await fixtureService.fetchFixturesInRange({ leagueId, start, end }).toPromise();
			setFixtures(fixtures);
		},
		[container, leagueId]
	);
	const fixtureFetchAsyncCallback = useAsyncCallback(fixtureFetchCallback);

	useEffectOnce(() => {
		fixtureFetchAsyncCallback.execute(dateRange.start, dateRange.end);
	});

	return (
		<div className={'sw-flex sw-flex-column sw-flex-grow'}>
			<div className={'sw-mb2 sw-flex'}>
				<div className={'sw-mr1'}>
					<SwDateRange
						name="datesRange"
						placeholder="Date Range"
						value={dateRange}
						minDate={seasonRange[0]}
						maxDate={seasonRange[1]}
						iconPosition="left"
						onClear={() => {
							setDateRange(defaultDateRange);
						}}
						onChange={(e, value) => {
							setDateRange(value);
						}}
					/>
				</div>
				<Button
					primary
					icon
					labelPosition="right"
					onClick={() => {
						if (!(dateRange.start && dateRange.end)) {
							return;
						}
						fixtureFetchAsyncCallback.execute(dateRange.start, dateRange.end);
					}}
				>
					<Icon name={'search'} />
					Search
				</Button>
			</div>
			{renderMatches()}
		</div>
	);

	function renderMatches() {
		if (!fixtures || fixtureFetchAsyncCallback.loading) {
			return <Spinner />;
		}
		if (!fixtures.length) {
			return <ErrorMessage message={'No fixtures found'} />;
		}
		const fixtureGroup = groupBy(fixtures, fixture => {
			return startOfDay(fixture.time).getTime();
		});
		return Object.entries(fixtureGroup)
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
			});
	}
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
export const SwFixturesList = SwFixtureListComponent;
