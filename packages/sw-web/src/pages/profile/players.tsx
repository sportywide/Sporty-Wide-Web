import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { Header } from 'semantic-ui-react';
import { SwManageProfilePlayers } from '@web/features/profile/players/components/ManageProfilePlayers';
import { LeagueService } from '@web/features/leagues/base/services/league.service';

class SwManagePlayersPage extends React.Component<any> {
	static async getInitialProps({ query, store }) {
		const container = store.container;
		const leagueService = container.get(LeagueService);
		const leagueId = parseInt(query.id, 10);
		const league = await leagueService.fetchLeague(leagueId).toPromise();
		return {
			leagueId,
			league,
		};
	}
	render() {
		return (
			<SwGreyBackground padding={true}>
				<Head>
					<title>{this.props.league.title}</title>
				</Head>
				<SwContainer>
					<Header as={'h1'}>Welcome to {this.props.league.title}</Header>
					<Header as={'h3'}>Your players</Header>
					<SwManageProfilePlayers leagueId={this.props.leagueId} />
				</SwContainer>
			</SwGreyBackground>
		);
	}
}

export default SwManagePlayersPage;
