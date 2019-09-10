import React from 'react';
import { Header } from 'semantic-ui-react';
import { SwBasicProfile } from '@web/features/profile/edit/components/BasicProfile';
import { SwWorkProfile } from '@web/features/profile/edit/components/WorkProfile';
import { SwFormSegment } from '@web/features/profile/edit/styled/edit.styled';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { SwSummaryProfile } from '@web/features/profile/edit/components/SummaryProfile';

interface IProps {
	user: IUser;
}

const SwEditProfileComponent: React.FC<IProps> = ({ user }) => {
	return (
		<div className={'ub-mt4'}>
			<SwFormSegment>
				<Header as={'h3'}> Basic Profile </Header>
				<SwBasicProfile user={user} />
			</SwFormSegment>

			<SwFormSegment>
				<Header as={'h3'}> Work and Education </Header>
				<SwWorkProfile user={user} />
			</SwFormSegment>

			<SwFormSegment>
				<Header as={'h3'}> Other information </Header>
				<SwSummaryProfile user={user} />
			</SwFormSegment>
		</div>
	);
};
export const SwEditProfile = SwEditProfileComponent;
