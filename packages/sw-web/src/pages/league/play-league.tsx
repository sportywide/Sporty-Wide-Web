import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { Header, Tab } from 'semantic-ui-react';
import { SwMyManagedPlayers } from '@web/features/profile/players/components/MyProfilePlayers';
import { LeagueService } from '@web/features/leagues/base/services/league.service';
import { SwLeagueStandings } from '@web/features/leagues/base/components/LeagueStanding';
import { SwFixturesList } from '@web/features/fixtures/components/FixturesList';
import { DndProvider } from 'react-dnd-cjs';
import html5Backend from 'react-dnd-html5-backend-cjs';
import { SwMyLineup } from '@web/features/lineup/components/MyLineup';
import { TabPane, updateTab } from '@web/shared/lib/tab/TabPane';
import { registerUrlChange } from '@web/shared/lib/url';

class SwPlayerLeaguePage extends React.Component<any, any> {
	panes: any[];
	defaultTabIndex: number;
	urlChangeListener: Function;

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
			defaultTab: query.tab,
		};
	}
	constructor(props) {
		super(props);
		this.panes = [
			{
				name: 'players',
				menuItem: 'Players',
				render: () => (
					<TabPane>
						<SwMyManagedPlayers leagueId={this.props.leagueId} />
					</TabPane>
				),
			},
			{
				name: 'standings',
				menuItem: 'Standings',
				render: () => (
					<TabPane>
						<SwLeagueStandings league={this.props.league} />
					</TabPane>
				),
			},
			{
				name: 'fixtures',
				menuItem: 'Fixtures',
				render: () => (
					<TabPane>
						<SwFixturesList leagueId={this.props.leagueId} />
					</TabPane>
				),
			},
			{
				name: 'lineup',
				menuItem: 'Lineup',
				render: () => (
					<TabPane>
						<DndProvider backend={html5Backend}>
							<SwMyLineup leagueId={this.props.leagueId} />
						</DndProvider>
					</TabPane>
				),
			},
		];
		this.defaultTabIndex = updateTab(this.panes, this.props.defaultTab);
		this.state = {
			activeTabIndex: this.defaultTabIndex,
		};
	}

	componentDidMount(): void {
		this.urlChangeListener = registerUrlChange(newUrl => {
			const newTab = newUrl.query.tab;
			const newActiveIndex = this.panes.findIndex(({ name }) => name === newTab);
			this.setState({
				activeTabIndex: newActiveIndex,
			});
		});
	}

	componentWillUnmount(): void {
		this.urlChangeListener();
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
					<Tab
						activeIndex={this.state.activeTabIndex}
						onTabChange={(e, { activeIndex }) => {
							const selectedTab = this.panes[activeIndex];
							const selectedTabName = (selectedTab && selectedTab.name) || 'players';
							updateTab(this.panes, selectedTabName);
						}}
						menu={{ secondary: true, pointing: true }}
						panes={this.panes}
						className={'sw-flex-grow sw-flex sw-flex-column'}
					/>
				</SwContainer>
			</SwGreyBackground>
		);
	}
}

export default SwPlayerLeaguePage;
