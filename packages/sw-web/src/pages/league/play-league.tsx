import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { Header } from 'semantic-ui-react';
import { SwManageProfilePlayers } from '@web/features/profile/players/components/ManageProfilePlayers';
import { LeagueService } from '@web/features/leagues/base/services/league.service';
import { SwLeagueStandings } from '@web/features/leagues/base/components/LeagueStanding';
import { SwWeekFixtures } from '@web/features/fixtures/components/WeekFixtures';

class SwManagePlayersPage extends React.Component<any> {
	static async getInitialProps({ query, store }) {
		const container = store.container;
		const leagueService = container.get(LeagueService);
		if (isNaN(query.id)) {
			return {};
		}
		const leagueId = parseInt(query.id, 10);
		const league = await leagueService.fetchLeague(leagueId).toPromise();
		return {
			leagueId,
			league,
		};
	}
	render() {
		if (!this.props.league) {
			return null;
		}
		return (
			<SwGreyBackground padding={true}>
				<Head>
					<title>{this.props.league.title}</title>
				</Head>
				<SwContainer>
					<Header as={'h1'}>Welcome to {this.props.league.title}</Header>
					<Header as={'h3'}>Your players</Header>
					<SwManageProfilePlayers leagueId={this.props.leagueId} />
					<Header as={'h3'}>League Standings</Header>
					<SwLeagueStandings league={this.props.league} />
					<Header as={'h3'}>This week fixtures</Header>
					<SwWeekFixtures leagueId={this.props.leagueId} />
				</SwContainer>
			</SwGreyBackground>
		);
	}
}

export default SwManagePlayersPage;
