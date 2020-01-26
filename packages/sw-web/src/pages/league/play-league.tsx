import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { Header } from 'semantic-ui-react';
import { SwMyManagedPlayers } from '@web/features/players/components/MyProfilePlayers';
import { LeagueService } from '@web/features/leagues/base/services/league.service';
import { SwLeagueStandings } from '@web/features/leagues/base/components/LeagueStanding';
import { SwFixturesList } from '@web/features/fixtures/components/FixturesList';
import { DndProvider } from 'react-dnd-cjs';
import html5Backend from 'react-dnd-html5-backend-cjs';
import { SwMyLineup } from '@web/features/lineup/components/MyLineup';
import { SwTabPane } from '@web/shared/lib/ui/components/tab/TabPane';
import { SwTab } from '@web/shared/lib/ui/components/tab/Tab';
import { SwMyPlayersBetting } from '@web/features/players/components/MyPlayerBetting';
import { PlayerBettingService } from '@web/features/players/services/player-betting.service';
import { fetchMyScore } from '@web/features/user/store/actions';
import { compose } from '@shared/lib/utils/fp/combine';
import { connect } from 'react-redux';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { userScoreReducer } from '@web/features/user/store/reducers';
import { fetchMyUserScoreEpic } from '@web/features/user/store/epics';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import styled from 'styled-components';
import { SwIcon } from '@web/shared/lib/icon';
import { withTabs } from '@web/shared/lib/ui/components/tab/withTab';

const LeagueHeader = styled(Header)`
	&&& {
		margin: 5px;
	}
`;

class SwPlayerLeaguePage extends React.Component<any, any> {
	static async getInitialProps({ query, store }) {
		const container = store.container;
		const leagueService = container.get(LeagueService);
		const playerBettingService = container.get(PlayerBettingService);
		if (isNaN(query.id)) {
			return {};
		}
		const leagueId = parseInt(query.id, 10);
		const [league, { hasBetting }] = await Promise.all([
			leagueService.fetchLeague(leagueId).toPromise(),
			playerBettingService.hasBetting({ leagueId }).toPromise(),
			store.dispatch(fetchMyScore(query.id)),
		]);

		return {
			leagueId,
			hasBetting,
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
					<div className={'sw-flex sw-flex-center sw-flex-wrap'}>
						<LeagueHeader as={'h1'}>Welcome to {this.props.league.title}</LeagueHeader>
						<div className={'sw-flex sw-flex-center sw-ml2'}>
							<SwIcon width={25} name={'token'} />
							<span className={'sw-ml1'}>
								{this.props.userScore && this.props.userScore.current.tokens}
							</span>
						</div>
					</div>
					<SwTab
						activeIndex={this.props.activeTabIndex}
						onTabChange={this.props.onTabChange}
						menu={{ secondary: true, pointing: true }}
						panes={this.props.tabs}
						className={'sw-flex-grow sw-flex sw-flex-column'}
					/>
				</SwContainer>
			</SwGreyBackground>
		);
	}
}

function getTabs(props) {
	return [
		{
			name: 'players',
			menuItem: 'Players',
			render: () => (
				<SwTabPane>
					<SwMyManagedPlayers leagueId={props.leagueId} />
				</SwTabPane>
			),
		},
		{
			name: 'standings',
			menuItem: 'Standings',
			render: () => (
				<SwTabPane>
					<SwLeagueStandings league={props.league} />
				</SwTabPane>
			),
		},
		{
			name: 'fixtures',
			menuItem: 'Fixtures',
			render: () => (
				<SwTabPane>
					<SwFixturesList leagueId={props.leagueId} />
				</SwTabPane>
			),
		},
		{
			name: 'lineup',
			menuItem: 'Lineup',
			render: () => (
				<SwTabPane>
					<DndProvider backend={html5Backend}>
						<SwMyLineup leagueId={props.leagueId} />
					</DndProvider>
				</SwTabPane>
			),
		},
		{
			name: 'betting',
			menuItem: 'Betting',
			condition: () => props.hasBetting,
			render: () => (
				<SwTabPane>
					<SwMyPlayersBetting leagueId={props.leagueId} />
				</SwTabPane>
			),
		},
	].filter(({ condition }) => !condition || condition());
}

const enhance = compose(
	registerReducer({ userScore: userScoreReducer }),
	registerEpic(fetchMyUserScoreEpic),
	connect(state => ({ userScore: state.userScore }), { fetchMyScore }),
	withTabs(getTabs)
);
export default enhance(SwPlayerLeaguePage);
