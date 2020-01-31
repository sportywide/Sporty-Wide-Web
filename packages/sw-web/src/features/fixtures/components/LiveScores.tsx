import React, { useContext, useState } from 'react';
import { ContainerContext } from '@web/shared/lib/store';
import { FixtureService } from '@web/features/fixtures/services/fixture.service';
import { useAsync } from 'react-async-hook';
import { groupBy, sortBy } from 'lodash';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';
import { ErrorMessage } from '@web/shared/lib/ui/components/error/Error';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';
import { formatRelative, startOfDay } from 'date-fns';
import { FixtureRow } from '@web/features/fixtures/components/FixtureRow';
import { ucfirst } from '@shared/lib/utils/string/conversion';
import * as S from './FixtureList.styled';

const SwLiveScoreComponent: React.FC<any> = () => {
	const container = useContext(ContainerContext);
	const [fixtures, setFixtures] = useState<FixtureDto[]>(null);

	const fixtureFetchCallback = useAsync(async () => {
		const fixtureService = container.get(FixtureService);
		const fixtures = await fixtureService.fetchLiveScores().toPromise();
		setFixtures(fixtures);
	}, []);

	return <div className={'sw-flex sw-flex-column sw-flex-grow'}>{renderMatches()}</div>;

	function renderMatches() {
		if (!fixtures || fixtureFetchCallback.loading) {
			return <Spinner portalRoot={'#container'} />;
		}
		if (!fixtures.length) {
			return <ErrorMessage message={'No live fixtures'} />;
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
						<S.FixtureDateHeadline as={'h4'}>{formatDay(timeGroup)}</S.FixtureDateHeadline>
						{sortBy(fixtures, 'time').map(fixture => (
							<FixtureRow key={fixture.id} fixture={fixture} />
						))}
					</div>
				);
			});
	}
};

function formatDay(date) {
	const relativeDate = formatRelative(date, new Date());
	return ucfirst(relativeDate.split(/\s+/)[0]);
}

export const SwLiveScore = SwLiveScoreComponent;
