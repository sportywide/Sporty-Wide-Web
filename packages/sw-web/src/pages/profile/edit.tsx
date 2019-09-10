import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/core.styled';
import { SwEditProfile } from '@web/features/profile/edit/components/EditProfile';
import { Grid, GridColumn } from 'semantic-ui-react';
import { allowAll, checkUser } from '@web/shared/lib/auth/check-user';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';

class SwEditProfilePage extends React.Component<any> {
	render() {
		return (
			<SwGreyBackground>
				<Head>
					<title>Edit your profile</title>
				</Head>
				<SwContainer>
					<Grid verticalAlign={'middle'} centered>
						<GridColumn mobile={13} tablet={13} computer={13}>
							<SwEditProfile
								user={{
									username: 'vdtn359',
									email: 'vdtn359@gmail.com',
									firstName: 'Tuan',
									lastName: 'Nguyen',
									socialProvider: null,
									status: UserStatus.ACTIVE,
									id: 1,
									name: 'Tuan Nguyen',
								}}
							/>
						</GridColumn>
					</Grid>
				</SwContainer>
			</SwGreyBackground>
		);
	}
}

export default checkUser(allowAll)(SwEditProfilePage);
//export default withContext(UserContext, 'user')(SwEditProfilePage);
