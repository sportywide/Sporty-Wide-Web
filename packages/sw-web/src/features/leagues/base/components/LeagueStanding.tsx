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
import { Table } from 'semantic-ui-react';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';

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
		<div style={{ maxWidth: '100%', overflowX: 'auto' }}>
			<Table padded unstackable>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Pos</Table.HeaderCell>
						<Table.HeaderCell>Name</Table.HeaderCell>
						<Table.HeaderCell>Played</Table.HeaderCell>
						<Table.HeaderCell>Wins</Table.HeaderCell>
						<Table.HeaderCell>Draws</Table.HeaderCell>
						<Table.HeaderCell>Losses</Table.HeaderCell>
						<Table.HeaderCell>Scored</Table.HeaderCell>
						<Table.HeaderCell>Conceded</Table.HeaderCell>
						<Table.HeaderCell>Points</Table.HeaderCell>
						<Table.HeaderCell>Forms</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{leagueStandings.table.map((leagueResult, i) => (
						<Table.Row key={i}>
							<Table.Cell>{i + 1}</Table.Cell>
							<Table.Cell>{leagueResult.name}</Table.Cell>
							<Table.Cell>{leagueResult.played}</Table.Cell>
							<Table.Cell>{leagueResult.wins}</Table.Cell>
							<Table.Cell>{leagueResult.draws}</Table.Cell>
							<Table.Cell>{leagueResult.losses}</Table.Cell>
							<Table.Cell>{leagueResult.scored}</Table.Cell>
							<Table.Cell>{leagueResult.conceded}</Table.Cell>
							<Table.Cell>{leagueResult.points}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
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
