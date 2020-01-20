import React from 'react';
import { connect } from 'react-redux';
import { checkUser, notAllowActive } from '@web/shared/lib/auth/check-user';
import Head from 'next/head';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { redirect } from '@web/shared/lib/navigation/helper';
import { Link } from '@web/routes';
import { SwLoginForm } from '@web/features/auth/components/LoginForm';
import { compose } from '@shared/lib/utils/fp/combine';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { authReducer } from '@web/features/auth/store/reducers';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { loginEpic } from '@web/features/auth/store/epics';
import { login } from '@web/features/auth/store/actions';
import { SwPrimaryBackGround } from '@web/shared/styled/Background.styled';
import { Container, Grid, GridColumn } from 'semantic-ui-react';
import { getUser } from '@web/shared/lib/store';
import { EqualTab } from '@web/features/tab/components/TabItem.styled';

interface IProps {
	login: Function;
}

class SwLoginPage extends React.Component<IProps, any> {
	static async getInitialProps(context) {
		const { store } = context;
		const pageProps = {};

		const currentUser = getUser(store);
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
			<>
				<Head>
					<title>Welcome</title>
				</Head>
				<SwPrimaryBackGround className="sw-flex sw-flex-center sw-flex-justify-center">
					<Container style={{ width: '100%' }}>
						<Grid verticalAlign={'middle'} centered>
							<GridColumn mobile={14} tablet={8} computer={6}>
								<div className="ui top sw-flex attached tabular menu">
									<EqualTab active data-tab="login">
										<Link route="login">
											<a onClick={e => e.preventDefault()}>Log In</a>
										</Link>
									</EqualTab>
									<EqualTab data-tab="signup">
										<Link route="signup">
											<a>Sign Up</a>
										</Link>
									</EqualTab>
								</div>
								<div className="ui bottom attached segment" data-tab="login">
									<SwLoginForm onLogin={userDto => this.props.login(userDto)} />
									<div className="ui horizontal divider">or</div>
									<div className="sw-flex sw-flex-center sw-flex-justify-center">
										<button className="ui facebook button">
											<a className="sw-link sw-link--white" href="/auth/facebook">
												<i className="facebook icon" />
												Facebook
											</a>
										</button>
										<button className="ui google plus button">
											<a className="sw-link sw-link--white" href="/auth/google">
												<i className="google plus icon" />
												Google Plus
											</a>
										</button>
									</div>
								</div>
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
	registerEpic(loginEpic),
	connect(null, { login })
);

export default enhance(SwLoginPage);
