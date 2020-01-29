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
import { TableRow, TableCell, StickyTable, TableHeader } from '@web/shared/lib/ui/components/table/Table';

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
			<StickyTable>
				<TableRow>
					<TableHeader>Name</TableHeader>
					<TableHeader>Played</TableHeader>
					<TableHeader>Wins</TableHeader>
					<TableHeader>Draws</TableHeader>
					<TableHeader>Losses</TableHeader>
					<TableHeader>Scored</TableHeader>
					<TableHeader>Conceded</TableHeader>
					<TableHeader>Points</TableHeader>
				</TableRow>

				{leagueStandings.table.map((leagueResult, i) => (
					<TableRow key={i}>
						<TableCell>
							{i + 1}. {leagueResult.name}
						</TableCell>
						<TableCell>{leagueResult.played}</TableCell>
						<TableCell>{leagueResult.wins}</TableCell>
						<TableCell>{leagueResult.draws}</TableCell>
						<TableCell>{leagueResult.losses}</TableCell>
						<TableCell>{leagueResult.scored}</TableCell>
						<TableCell>{leagueResult.conceded}</TableCell>
						<TableCell>{leagueResult.points}</TableCell>
					</TableRow>
				))}
			</StickyTable>
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
