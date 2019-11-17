import React from 'react';
import Head from 'next/head';
import { SwFluidContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
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
			<SwGreyBackground>
				<Head>
					<title>Manage your players</title>
				</Head>
				<SwFluidContainer>
					<Grid verticalAlign={'middle'} centered>
						<GridColumn mobile={13} tablet={13} computer={13}>
							<SwManageProfilePlayers leagueId={this.props.leagueId} />
						</GridColumn>
					</Grid>
				</SwFluidContainer>
			</SwGreyBackground>
		);
	}
}

export default SwManagePlayersPage;
