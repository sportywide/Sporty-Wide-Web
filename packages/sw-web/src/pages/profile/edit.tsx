import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/core.styled';
import { SwEditProfile } from '@web/features/profile/edit/components/EditProfile';
import { Grid, GridColumn, Loader } from 'semantic-ui-react';
import { withContext } from '@web/shared/lib/context/providers';
import { compose } from 'recompose';
import { UserContext } from '@web/shared/lib/store';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { connect } from 'react-redux';
import {
	fetchBasicUserProfileEpic,
	fetchUserProfileEpic,
	saveBasicUserProfileEpic,
} from '@web/features/profile/store/epics';
import { fetchUserProfile } from '@web/features/profile/store/actions';
import { IUserProfile, userProfileReducer } from '@web/features/profile/store/reducers';
import { IUser } from '@web/shared/lib/interfaces/auth/user';

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
			return <Loader />;
		}
		return (
			<SwGreyBackground>
				<Head>
					<title>Edit your profile</title>
				</Head>
				<SwContainer>
					<Grid verticalAlign={'middle'} centered>
						<GridColumn mobile={13} tablet={13} computer={13}>
							<SwEditProfile userProfile={this.props.userProfile} />
						</GridColumn>
					</Grid>
				</SwContainer>
			</SwGreyBackground>
		);
	}
}

const enhancer = compose(
	withContext(UserContext, 'user'),
	registerReducer({ userProfile: userProfileReducer }),
	registerEpic(fetchBasicUserProfileEpic, fetchUserProfileEpic, saveBasicUserProfileEpic),
	connect(
		state => ({ userProfile: state.userProfile }),
		{
			fetchUserProfile,
		}
	)
);

export default enhancer(SwEditProfilePage);
