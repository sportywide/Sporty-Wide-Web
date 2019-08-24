import React from 'react';
import { allowAnonymousOnly, checkUser } from '@web/shared/lib/auth/check-user';
import Head from 'next/head';

class SignupComponent extends React.Component<any> {
	render() {
		return (
			<div className="ub-p4">
				<Head>
					<title>Sign up</title>
				</Head>
				<h1>Sign up Page</h1>
			</div>
		);
	}
}
export default checkUser(allowAnonymousOnly, 'home')(SignupComponent);
