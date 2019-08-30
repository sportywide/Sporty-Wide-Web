import React from 'react';
import { checkUser, notAllowActive } from '@web/shared/lib/auth/check-user';
import Head from 'next/head';

class SwConfirmEmailPage extends React.Component<any> {
	render() {
		return (
			<div className="ub-p4">
				<h1>Confirm Email Page</h1>
				<Head>
					<title>Confirm Email</title>
				</Head>
				<div>Please confirm your email</div>
			</div>
		);
	}
}
export default checkUser(notAllowActive, 'home')(SwConfirmEmailPage);
