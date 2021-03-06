import React from 'react';
import Head from 'next/head';
import { SwFluidContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { SwEditProfile } from '@web/features/profile/edit/components/EditProfile';
import { Grid, GridColumn } from 'semantic-ui-react';
import { compose } from 'recompose';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { connect } from 'react-redux';
import {
	fetchBasicUserProfileEpic,
	fetchExtraUserProfileEpic,
	fetchUserProfileEpic,
	saveBasicUserProfileEpic,
	saveExtraUserProfileEpic,
} from '@web/features/profile/edit/store/epics';
import { fetchUserProfile } from '@web/features/profile/edit/store/actions';
import { IUserProfile, userProfileReducer } from '@web/features/profile/edit/store/reducers';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';

interface IProps {
	userProfile: IUserProfile;
	user: IUser;
	fetchUserProfile: typeof fetchUserProfile;
}
class SwEditProfilePage extends React.Component<IProps> {
	componentDidMount(): void {
		this.props.fetchUserProfile(this.props.user.id);
	}

	render() {
		if (!(this.props.userProfile && this.props.userProfile.basic)) {
			return <Spinner />;
		}
		return (
			<SwGreyBackground padding={true}>
				<Head>
					<title>Edit your profile</title>
				</Head>
				<SwFluidContainer>
					<Grid verticalAlign={'middle'} centered>
						<GridColumn mobile={13} tablet={13} computer={13}>
							<SwEditProfile userProfile={this.props.userProfile} />
						</GridColumn>
					</Grid>
				</SwFluidContainer>
			</SwGreyBackground>
		);
	}
}

const enhancer = compose(
	registerReducer({ userProfile: userProfileReducer }),
	registerEpic(
		fetchBasicUserProfileEpic,
		fetchUserProfileEpic,
		fetchExtraUserProfileEpic,
		saveBasicUserProfileEpic,
		saveExtraUserProfileEpic
	),
	connect(state => ({ userProfile: state.userProfile, user: state.auth && state.auth.user }), {
		fetchUserProfile,
	})
);

export default enhancer(SwEditProfilePage);
