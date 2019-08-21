import React from 'react';
import { allowUnauthenticated } from '@web/shared/lib/auth/allow-unauthenticated';
import Head from 'next/head';

class LoginComponent extends React.Component<any> {
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
				</div>
			</div>
		);
	}
}
export default allowUnauthenticated(LoginComponent);
