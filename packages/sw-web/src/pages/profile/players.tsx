import React from 'react';
import Head from 'next/head';
import { SwFluidContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { Grid, GridColumn, Loader } from 'semantic-ui-react';
import { compose } from 'recompose';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { connect } from 'react-redux';
import { IProfilePlayers, profilePlayersReducer } from '@web/features/profile/players/store/reducers';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { fetchProfilePlayers } from '@web/features/profile/players/store/actions';
import { fetchProfilePlayersEpic } from '@web/features/profile/players/store/epics';
import { SwManageProfilePlayers } from '@web/features/profile/players/components/ManageProfilePlayers';

interface IProps {
	profilePlayers: IProfilePlayers;
	user: IUser;
	fetchProfilePlayers: typeof fetchProfilePlayers;
}
class SwManagePlayersPage extends React.Component<IProps> {
	componentDidMount(): void {
		this.props.fetchProfilePlayers(this.props.user.id);
	}

	handleRenewContract = () => {
		console.log('handleRenewContract');
	};

	render() {
		if (!this.props.profilePlayers || (!!this.props.profilePlayers && this.props.profilePlayers.loading)) {
			return <Loader />;
		}
		return (
			<SwGreyBackground>
				<Head>
					<title>Manage your players</title>
				</Head>
				<SwFluidContainer>
					<Grid verticalAlign={'middle'} centered>
						<GridColumn mobile={13} tablet={13} computer={13}>
							<SwManageProfilePlayers
								players={this.props.profilePlayers.players}
								renewContract={this.handleRenewContract}
							></SwManageProfilePlayers>
						</GridColumn>
					</Grid>
				</SwFluidContainer>
			</SwGreyBackground>
		);
	}
}

const enhancer = compose(
	registerReducer({ profilePlayers: profilePlayersReducer }),
	registerEpic(fetchProfilePlayersEpic),
	connect(
		state => ({ profilePlayers: state.profilePlayers, user: state.auth && state.auth.user }),
		{
			fetchProfilePlayers,
		}
	)
);

export default enhancer(SwManagePlayersPage);
