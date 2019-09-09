import React from 'react';
import { allowAnonymousOnly, checkUser, notAllowActive } from '@web/shared/lib/auth/check-user';
import Head from 'next/head';
import { Link } from '@web/routes';
import { SwSignupForm } from '@web/features/auth/components/SignupForm';
import { redirect } from '@web/shared/lib/navigation/helper';

class SwSignupPage extends React.Component<any> {
	handleShowLogin = async event => {
		event.preventDefault();
		await redirect({ route: 'login', refresh: false });
	};

	render() {
		return (
			<div className="ub-p4">
				<h1>Welcome</h1>
				<Head>
					<title>Welcome</title>
				</Head>
				<div className="ui top attached tabular menu">
					<a className="item" data-tab="login" onClick={this.handleShowLogin}>
						Login
					</a>
					<a className="item active" data-tab="signup" onClick={event => event.preventDefault()}>
						Signup
					</a>
				</div>
				<div className="ui bottom attached segment" data-tab="signup">
					<SwSignupForm />
					<hr/>
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
export default checkUser(allowAnonymousOnly, 'home')(SwSignupPage);
