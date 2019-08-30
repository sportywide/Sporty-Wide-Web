import React from 'react';
import { SwConfirmSocial } from '@web/features/auth/components/ConfirmSocialComponent';
import { SwPrimaryBackGround } from '@web/shared/styled/core.styled';
import Head from 'next/head';
import { Container, Grid, GridColumn } from 'semantic-ui-react';
import { allowPendingSocialOnly, checkUser } from '@web/shared/lib/auth/check-user';

class SwConfirmSocialPage extends React.Component<any> {
	render() {
		return (
			<>
				<Head>
					<title>Complete your account</title>
				</Head>
				<SwPrimaryBackGround>
					<Container style={{ width: '100%' }}>
						<Grid verticalAlign={'middle'} centered>
							<GridColumn mobile={14} tablet={8} computer={6}>
								<SwConfirmSocial />
							</GridColumn>
						</Grid>
					</Container>
				</SwPrimaryBackGround>
			</>
		);
	}
}

export default checkUser(allowPendingSocialOnly, 'home')(SwConfirmSocialPage);
