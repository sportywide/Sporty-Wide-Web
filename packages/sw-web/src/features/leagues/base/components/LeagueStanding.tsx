import React, { useEffect } from 'react';
import { SelectableLeagueDto } from '@shared/lib/dtos/leagues/user-league.dto';
import { connect } from 'react-redux';
import { compose } from '@shared/lib/utils/fp/combine';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { fetchLeaguesStandingEpic } from '@web/features/leagues/base/store/epics';
import { leagueStandingReducer } from '@web/features/leagues/base/store/reducers/league-standing-reducer';
import { fetchLeagueStandings } from '@web/features/leagues/base/store/actions';
import { LeagueStandingsDto } from '@shared/lib/dtos/leagues/league-standings.dto';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';
import { SwTableRow, SwTableCell, SwStickyTable, SwTableHeader } from '@web/shared/lib/ui/components/table/Table';

interface IProps {
	league: SelectableLeagueDto;
	leagueStandings: LeagueStandingsDto;
	fetchLeagueStandings: typeof fetchLeagueStandings;
}

const SwLeagueStandingsComponent: React.FC<IProps> = ({ league, leagueStandings, fetchLeagueStandings }) => {
	useEffect(() => {
		fetchLeagueStandings(league.id);
	}, [fetchLeagueStandings, league.id]);
	if (!leagueStandings) {
		return <Spinner portalRoot={'#container'} />;
	}
	return (
		<div style={{ width: '100%' }}>
			<SwStickyTable>
				<SwTableRow>
					<SwTableHeader>Name</SwTableHeader>
					<SwTableHeader>Played</SwTableHeader>
					<SwTableHeader>Wins</SwTableHeader>
					<SwTableHeader>Draws</SwTableHeader>
					<SwTableHeader>Losses</SwTableHeader>
					<SwTableHeader>Scored</SwTableHeader>
					<SwTableHeader>Conceded</SwTableHeader>
					<SwTableHeader>Points</SwTableHeader>
				</SwTableRow>

				{leagueStandings.table.map((leagueResult, i) => (
					<SwTableRow key={i}>
						<SwTableCell>
							{i + 1}. {leagueResult.name}
						</SwTableCell>
						<SwTableCell>{leagueResult.played}</SwTableCell>
						<SwTableCell>{leagueResult.wins}</SwTableCell>
						<SwTableCell>{leagueResult.draws}</SwTableCell>
						<SwTableCell>{leagueResult.losses}</SwTableCell>
						<SwTableCell>{leagueResult.scored}</SwTableCell>
						<SwTableCell>{leagueResult.conceded}</SwTableCell>
						<SwTableCell>{leagueResult.points}</SwTableCell>
					</SwTableRow>
				))}
			</SwStickyTable>
		</div>
	);
};

const enhance = compose(
	registerReducer({ leagueStandings: leagueStandingReducer }),
	registerEpic(fetchLeaguesStandingEpic),
	connect(
		(state, ownProps) => ({
			leagueStandings: state.leagueStandings && state.leagueStandings[ownProps.league && ownProps.league.id],
		}),
		{ fetchLeagueStandings }
	)
);

export const SwLeagueStandings = enhance(SwLeagueStandingsComponent);
