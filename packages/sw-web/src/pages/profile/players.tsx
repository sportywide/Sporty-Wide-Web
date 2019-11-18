import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { Grid, GridColumn } from 'semantic-ui-react';
import { SwManageProfilePlayers } from '@web/features/profile/players/components/ManageProfilePlayers';

class SwManagePlayersPage extends React.Component<any> {
	static async getInitialProps({ query }) {
		return {
			leagueId: parseInt(query.id, 10),
		};
	}
	render() {
		return (
			<SwGreyBackground padding={true}>
				<Head>
					<title>Manage your players</title>
				</Head>
				<SwContainer>
					<SwManageProfilePlayers leagueId={this.props.leagueId} />
				</SwContainer>
			</SwGreyBackground>
		);
	}
}

export default SwManagePlayersPage;
