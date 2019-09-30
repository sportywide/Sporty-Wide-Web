import React from 'react';
import { SwConfirmSocial } from '@web/features/auth/components/ConfirmSocial';
import { SwFluidContainer, SwPrimaryBackGround } from '@web/shared/styled/Background.styled';
import Head from 'next/head';
import { Grid, GridColumn } from 'semantic-ui-react';
import { allowPendingSocialOnly, checkUser } from '@web/shared/lib/auth/check-user';

class SwConfirmSocialPage extends React.Component<any> {
	render() {
		return (
			<>
				<Head>
					<title>Complete your profile</title>
				</Head>
				<SwPrimaryBackGround className={'sw-flex sw-flex-center'}>
					<SwFluidContainer>
						<Grid verticalAlign={'middle'} centered>
							<GridColumn mobile={14} tablet={8} computer={6}>
								<SwConfirmSocial />
							</GridColumn>
						</Grid>
					</SwFluidContainer>
				</SwPrimaryBackGround>
			</>
		);
	}
}

export default checkUser(allowPendingSocialOnly, 'home')(SwConfirmSocialPage);
