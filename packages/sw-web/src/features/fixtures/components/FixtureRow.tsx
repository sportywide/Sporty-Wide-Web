import { redirect } from '@web/shared/lib/navigation/helper';
import * as S from '@web/features/fixtures/components/FixtureRow.styled';
import React from 'react';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';
import { format } from 'date-fns';

interface IProps {
	fixture: FixtureDto;
}

export function FixtureRow({ fixture }) {
	return (
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
					{fixture.status === 'PENDING' ? 'VS' : `${fixture.homeScore} - ${fixture.awayScore}`}
				</S.FixtureScore>
				<S.FixtureTeam className={'sw-truncate'}>{fixture.away}</S.FixtureTeam>
			</S.FixtureMain>
			<S.FixtureStatus>{renderStatus(fixture)}</S.FixtureStatus>
		</S.FixtureLine>
	);
}

function renderStatus(fixture: FixtureDto) {
	if (fixture.status === 'PENDING') {
		return 'PNDG';
	} else if (fixture.status === 'ACTIVE') {
		return `${fixture.current || 0}'`;
	} else {
		return fixture.status;
	}
}
