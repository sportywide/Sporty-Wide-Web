import React from 'react';
import { SwContainer, SwPrimaryBackGround } from '@web/shared/styled/core.styled';
import Head from 'next/head';
import { Grid, GridColumn, Container as SemanticContainer } from 'semantic-ui-react';
import { allowAnonymousOnly, checkUser } from '@web/shared/lib/auth/check-user';
import { SwResetPassword } from '@web/features/auth/components/ResetPassword';
import { redirect } from '@web/shared/lib/navigation/helper';
import { Container } from 'typedi';
import { UserService } from '@web/features/user/services/user.service';

class SwResetPasswordPage extends React.Component<any> {
	static async getInitialProps(context) {
		const pageProps = {};
		if (context.req) {
			const token = context.req.query.token;
			if (!token) {
				await redirect({ context, route: 'login', replace: true });
			}

			const container: typeof Container = context.store.container;
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
					<SwContainer>
						<Grid verticalAlign={'middle'} centered>
							<GridColumn mobile={12} tablet={8} computer={6}>
								<SwResetPassword token={this.props.token} user={this.props.user} />
							</GridColumn>
						</Grid>
					</SwContainer>
				</SwPrimaryBackGround>
			</>
		);
	}
}

export default checkUser(allowAnonymousOnly, 'home')(SwResetPasswordPage);
