import React from 'react';
import { checkUser, notAllowActive } from '@web/shared/lib/auth/check-user';
import Head from 'next/head';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { redirect } from '@web/shared/lib/navigation/helper';
import { Link } from '@web/routes';

class SwLoginPage extends React.Component<any> {
	static async getInitialProps(context) {
		const { store } = context;
		const pageProps = {};
		const container = store.container;
		const currentUser = container.get('currentUser');

		if (!currentUser) {
			return pageProps;
		}

		if (currentUser.socialProvider && currentUser.status === UserStatus.PENDING) {
			await redirect({ context, route: 'confirm-social', replace: true });
			return pageProps;
		}

		if (currentUser.status === UserStatus.PENDING) {
			await redirect({ context, route: 'confirm-email', replace: true });
			return pageProps;
		}

		return pageProps;
	}

	render() {
		return (
			<div className="ub-p4">
				<h1>Login Page</h1>
				<Head>
					<title>Login</title>
				</Head>
				<div>
					<button className="ui facebook button">
						<a className="link-white" href="/auth/facebook">
							<i className="facebook icon" />
							Facebook
						</a>
					</button>
					<button className="ui google plus button">
						<a className="link-white" href="/auth/google">
							<i className="google plus icon" />
							Google Plus
						</a>
					</button>
					<div>
						<Link route={'forgot-password'}>
							<a>Forgot your password?</a>
						</Link>
					</div>
				</div>
			</div>
		);
	}
}
export default checkUser(notAllowActive, 'home')(SwLoginPage);
