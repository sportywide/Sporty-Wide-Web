import React from 'react';
import { SwFluidContainer, SwPrimaryBackGround } from '@web/shared/styled/Background.styled';
import Head from 'next/head';
import { Grid, GridColumn } from 'semantic-ui-react';
import { allowAnonymousOnly, checkUser } from '@web/shared/lib/auth/check-user';
import { SwResetPassword } from '@web/features/auth/components/ResetPassword';
import { redirect } from '@web/shared/lib/navigation/helper';
import { ContainerInstance } from 'typedi';
import { UserService } from '@web/features/user/services/user.service';

class SwResetPasswordPage extends React.Component<any> {
	static async getInitialProps(context) {
		const pageProps = {};
		if (context.req) {
			const token = context.req.query.token;
			if (!token) {
				await redirect({ context, route: 'login', replace: true });
			}

			const container: ContainerInstance = context.store.container;
			const userService = container.get(UserService);

			const user = await userService.getUserFromToken(token).toPromise();

			if (!user) {
				await redirect({ context, route: 'login', replace: true });
			}

			return { ...pageProps, user, token };
		}

		return pageProps;
	}
	render() {
		return (
			<>
				<Head>
					<title>Reset your password</title>
				</Head>
				<SwPrimaryBackGround className={'ub-flex ub-flex-center'}>
					<SwFluidContainer>
						<Grid verticalAlign={'middle'} centered>
							<GridColumn mobile={12} tablet={8} computer={6}>
								<SwResetPassword token={this.props.token} user={this.props.user} />
							</GridColumn>
						</Grid>
					</SwFluidContainer>
				</SwPrimaryBackGround>
			</>
		);
	}
}

export default checkUser(allowAnonymousOnly, 'home')(SwResetPasswordPage);
