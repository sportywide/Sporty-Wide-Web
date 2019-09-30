import React from 'react';
import { connect } from 'react-redux';
import { checkUser, notAllowActive } from '@web/shared/lib/auth/check-user';
import Head from 'next/head';
import { SwPrimaryBackGround } from '@web/shared/styled/Background.styled';
import { Container, Grid, GridColumn } from 'semantic-ui-react';
import { SwConfirmEmail } from '@web/features/auth/components/ConfirmEmail';
import { compose } from '@shared/lib/utils/fp/combine';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { authReducer } from '@web/features/auth/store/reducers';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { resendVerificationEpic } from '@web/features/auth/store/epics';
import { resendVerificationEmail } from '@web/features/auth/store/actions';

interface IProps {
	resendVerificationEmail: Function;
}

class SwConfirmEmailPage extends React.Component<any> {
	render() {
		return (
			<>
				<Head>
					<title>Verify your email</title>
				</Head>
				<SwPrimaryBackGround>
					<Container style={{ width: '100%' }} className="sw-py4">
						<Grid verticalAlign={'middle'} centered>
							<GridColumn mobile={14} tablet={8} computer={6}>
								<SwConfirmEmail onResend={email => this.props.resendVerificationEmail(email)} />
							</GridColumn>
						</Grid>
					</Container>
				</SwPrimaryBackGround>
			</>
		);
	}
}

const enhance = compose(
	checkUser(notAllowActive, 'home'),
	registerReducer({ auth: authReducer }),
	registerEpic(resendVerificationEpic),
	connect(
		null,
		{ resendVerificationEmail }
	)
);

export default enhance(SwConfirmEmailPage);
