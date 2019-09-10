import React from 'react';
import { SwContainer, SwPrimaryBackGround } from '@web/shared/styled/core.styled';
import Head from 'next/head';
import { Container, Grid, GridColumn } from 'semantic-ui-react';
import { allowAnonymousOnly, checkUser } from '@web/shared/lib/auth/check-user';
import { SwForgotPassword } from '@web/features/auth/components/ForgotPassword';

class SwForgotPasswordPage extends React.Component<any> {
	render() {
		return (
			<>
				<Head>
					<title>Forgot your password</title>
				</Head>
				<SwPrimaryBackGround className={'ub-flex ub-flex-center'}>
					<SwContainer>
						<Grid verticalAlign={'middle'} centered>
							<GridColumn mobile={14} tablet={8} computer={6}>
								<SwForgotPassword />
							</GridColumn>
						</Grid>
					</SwContainer>
				</SwPrimaryBackGround>
			</>
		);
	}
}

export default checkUser(allowAnonymousOnly, 'home')(SwForgotPasswordPage);