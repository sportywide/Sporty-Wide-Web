import React from 'react';
import { Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { SwBasicProfile } from '@web/features/profile/edit/components/BasicProfile';
import { SwWorkProfile } from '@web/features/profile/edit/components/WorkProfile';
import { SwFormSegment } from '@web/features/profile/edit/components/edit.styled';
import { SwSummaryProfile } from '@web/features/profile/edit/components/SummaryProfile';
import { IUserProfile } from '@web/features/profile/edit/store/reducers';
import { saveBasicUserProfile, saveExtraUserProfile } from '@web/features/profile/edit/store/actions';

interface IProps {
	userProfile: IUserProfile;
	saveBasicUserProfile: typeof saveBasicUserProfile;
	saveExtraUserProfile: typeof saveExtraUserProfile;
}

const SwEditProfileComponent: React.FC<IProps> = ({ userProfile, saveBasicUserProfile, saveExtraUserProfile }) => {
	return (
		<div className={'ub-mt4'}>
			<SwFormSegment>
				<Header as={'h3'}> Basic Profile </Header>
				<SwBasicProfile
					user={userProfile.basic}
					didSaveProfile={profileData => saveBasicUserProfile({ id: userProfile.basic.id, profileData })}
				/>
			</SwFormSegment>

			<SwFormSegment>
				<Header as={'h3'}> Work and Education </Header>
				<SwWorkProfile
					profile={userProfile.extra}
					didSaveProfile={profileData => {
						saveExtraUserProfile({ id: userProfile.basic.id, profileData });
					}}
				/>
			</SwFormSegment>

			<SwFormSegment>
				<Header as={'h3'}> Other information </Header>
				<SwSummaryProfile
					profile={userProfile.extra}
					didSaveProfile={profileData => saveExtraUserProfile({ id: userProfile.basic.id, profileData })}
				/>
			</SwFormSegment>
		</div>
	);
};
export const SwEditProfile = connect(
	null,
	{
		saveBasicUserProfile,
		saveExtraUserProfile,
	}
)(SwEditProfileComponent);
