import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { Header, Tab } from 'semantic-ui-react';
import { SwMyManagedPlayers } from '@web/features/profile/players/components/MyProfilePlayers';
import { LeagueService } from '@web/features/leagues/base/services/league.service';
import { SwLeagueStandings } from '@web/features/leagues/base/components/LeagueStanding';
import { SwWeekFixtures } from '@web/features/fixtures/components/WeekFixtures';
import { DndProvider } from 'react-dnd-cjs';
import html5Backend from 'react-dnd-html5-backend-cjs';
import { SwMyLineup } from '@web/features/lineup/components/MyLineup';

class SwPlayerLeaguePage extends React.Component<any> {
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
		const panes = [
			{
				menuItem: 'Players',
				render: () => (
					<Tab.Pane as="div" attached={false} className={'sw-flex-grow sw-relative'}>
						<SwMyManagedPlayers leagueId={this.props.leagueId} />
					</Tab.Pane>
				),
			},
			{
				menuItem: 'Standings',
				render: () => (
					<Tab.Pane as="div" attached={false}>
						<SwLeagueStandings league={this.props.league} />
					</Tab.Pane>
				),
			},
			{
				menuItem: 'Fixtures',
				render: () => (
					<Tab.Pane as="div" attached={false}>
						<Header as={'h3'}>This week fixtures</Header>
						<SwWeekFixtures leagueId={this.props.leagueId} />
					</Tab.Pane>
				),
			},
			{
				menuItem: 'Lineup',
				render: () => (
					<Tab.Pane as="div" attached={false}>
						<DndProvider backend={html5Backend}>
							<SwMyLineup leagueId={this.props.leagueId} />
						</DndProvider>
					</Tab.Pane>
				),
			},
		];
		return (
			<SwGreyBackground padding={true}>
				<Head>
					<title>{this.props.league.title}</title>
				</Head>
				<SwContainer>
					<Header as={'h1'}>Welcome to {this.props.league.title}</Header>
					<Tab
						menu={{ secondary: true, pointing: true }}
						panes={panes}
						className={'sw-flex-grow sw-flex sw-flex-column'}
					/>
				</SwContainer>
			</SwGreyBackground>
		);
	}
}

export default SwPlayerLeaguePage;
