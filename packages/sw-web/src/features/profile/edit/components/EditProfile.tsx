import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import { SwBasicProfile } from '@web/features/profile/edit/components/BasicProfile';
import { SwFormSegment } from '@web/features/profile/edit/styled/edit.styled';
import { IUser } from '@web/shared/lib/interfaces/auth/user';

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

			<Segment>First segment</Segment>
		</div>
	);
};
export const SwEditProfile = SwEditProfileComponent;
