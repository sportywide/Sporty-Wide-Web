import React from 'react';
import { SwConfirmSocial } from '@web/features/auth/components/ConfirmSocial';
import { SwContainer, SwPrimaryBackGround } from '@web/shared/styled/core.styled';
import Head from 'next/head';
import { Container, Grid, GridColumn } from 'semantic-ui-react';
import { allowPendingSocialOnly, checkUser } from '@web/shared/lib/auth/check-user';

class SwConfirmSocialPage extends React.Component<any> {
	render() {
		return (
			<>
				<Head>
					<title>Complete your profile</title>
				</Head>
				<SwPrimaryBackGround className={'ub-flex ub-flex-center'}>
					<SwContainer>
						<Grid verticalAlign={'middle'} centered>
							<GridColumn mobile={14} tablet={8} computer={6}>
								<SwConfirmSocial />
							</GridColumn>
						</Grid>
					</SwContainer>
				</SwPrimaryBackGround>
			</>
		);
	}
}

export default checkUser(allowPendingSocialOnly, 'home')(SwConfirmSocialPage);