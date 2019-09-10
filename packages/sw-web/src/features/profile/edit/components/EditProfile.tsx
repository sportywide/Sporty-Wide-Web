import React, { useEffect, useContext, useState } from 'react';
import { Header } from 'semantic-ui-react';
import { SwBasicProfile } from '@web/features/profile/edit/components/BasicProfile';
import { SwWorkProfile } from '@web/features/profile/edit/components/WorkProfile';
import { SwFormSegment } from '@web/features/profile/edit/styled/edit.styled';
import { SwSummaryProfile } from '@web/features/profile/edit/components/SummaryProfile';
import { IUserProfile } from '@web/features/profile/store/reducers';

interface IProps {
	userProfile: IUserProfile;
}

const SwEditProfileComponent: React.FC<IProps> = ({ userProfile }) => {
	return (
		<div className={'ub-mt4'}>
			<SwFormSegment>
				<Header as={'h3'}> Basic Profile </Header>
				<SwBasicProfile user={userProfile.basic} />
			</SwFormSegment>

			<SwFormSegment>
				<Header as={'h3'}> Work and Education </Header>
				<SwWorkProfile user={userProfile.basic} />
			</SwFormSegment>

			<SwFormSegment>
				<Header as={'h3'}> Other information </Header>
				<SwSummaryProfile user={userProfile.basic} />
			</SwFormSegment>
		</div>
	);
};
export const SwEditProfile = SwEditProfileComponent;
