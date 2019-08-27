import React from 'react';
import { SwConfirmSocial } from '@web/features/auth/components/ConfirmSocialComponent';
import Head from 'next/head';

class SwConfirmSocialPage extends React.Component<any> {
	render() {
		return (
			<>
				<Head>
					<title>Complete your account</title>
				</Head>
				<SwConfirmSocial />
			</>
		);
	}
}
// export default checkUser(allowPendingSocialOnly, 'home')(ConfirmSocialPage);
export default SwConfirmSocialPage;
