import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { Button, Header, Icon, Tab } from 'semantic-ui-react';
import { SwManageProfilePlayers } from '@web/features/profile/players/components/ManageProfilePlayers';
import { LeagueService } from '@web/features/leagues/base/services/league.service';
import { SwLeagueStandings } from '@web/features/leagues/base/components/LeagueStanding';
import { SwWeekFixtures } from '@web/features/fixtures/components/WeekFixtures';
import styled from 'styled-components';
import { redirect } from '@web/shared/lib/navigation/helper';
import { device } from '@web/styles/constants/size';

const PlayButton = styled(Button)`
	position: initial;
	right: 10px;
	&&& {
		margin-bottom: 20px;
	}

	@media ${device.laptop} {
		position: absolute;
	}
`;
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
		const panes = [
			{
				menuItem: 'Players',
				render: () => (
					<Tab.Pane as="div" attached={false} className={'sw-relative'}>
						<PlayButton
							color={'blue'}
							onClick={() =>
								redirect({
									route: 'lineup-builder',
									params: {
										id: this.props.leagueId,
									},
								})
							}
						>
							Build your lineup <Icon name={'arrow right'} />
						</PlayButton>
						<SwManageProfilePlayers leagueId={this.props.leagueId} />
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
		];
		return (
			<SwGreyBackground padding={true}>
				<Head>
					<title>{this.props.league.title}</title>
				</Head>
				<SwContainer>
					<Header as={'h1'}>Welcome to {this.props.league.title}</Header>
					<Tab menu={{ secondary: true, pointing: true }} panes={panes} />
				</SwContainer>
			</SwGreyBackground>
		);
	}
}

export default SwManagePlayersPage;
