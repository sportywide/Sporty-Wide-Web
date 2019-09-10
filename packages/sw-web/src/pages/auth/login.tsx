import React from 'react';
import { checkUser, notAllowActive } from '@web/shared/lib/auth/check-user';
import Head from 'next/head';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { redirect } from '@web/shared/lib/navigation/helper';
import { Link } from '@web/routes';
import { SwLoginForm } from '@web/features/auth/components/LoginForm';

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
				<h1>Welcome</h1>
				<Head>
					<title>Welcome</title>
				</Head>
				<div className="ui top attached tabular menu">
					<Link route="login">
						<a className="item active" data-tab="login" onClick={e => e.preventDefault()}>
							Login
						</a>
					</Link>
					<Link route="signup">
						<a className="item" data-tab="signup">
							Signup
						</a>
					</Link>
				</div>
				<div className="ui bottom attached segment" data-tab="login">
					<SwLoginForm />
					<hr />
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
				</div>
			</div>
		);
	}
}
export default checkUser(notAllowActive, 'home')(SwLoginPage);
