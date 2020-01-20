import React from 'react';
import { connect } from 'react-redux';
import { allowAnonymousOnly, checkUser } from '@web/shared/lib/auth/check-user';
import Head from 'next/head';
import { Link } from '@web/routes';
import { SwSignupForm } from '@web/features/auth/components/SignupForm';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { signup } from '@web/features/auth/store/actions';
import { compose } from '@shared/lib/utils/fp/combine';
import { signupEpic } from '@web/features/auth/store/epics';
import { authReducer } from '@web/features/auth/store/reducers';
import { SwPrimaryBackGround } from '@web/shared/styled/Background.styled';
import { Container, Grid, GridColumn } from 'semantic-ui-react';
import { EqualTab } from '@web/features/tab/components/TabItem.styled';

interface IProps {
	signup: Function;
}

class SwSignupPage extends React.Component<IProps, any> {
	render() {
		return (
			<>
				<Head>
					<title>Welcome</title>
				</Head>
				<SwPrimaryBackGround className="sw-flex sw-flex-center sw-flex-justify-center">
					<Container style={{ width: '100%' }} className="sw-py4">
						<Grid verticalAlign={'middle'} centered>
							<GridColumn mobile={14} tablet={8} computer={6}>
								<div className="ui top sw-flex attached tabular menu">
									<EqualTab data-tab="login">
										<Link route="login">
											<a>Log In</a>
										</Link>
									</EqualTab>
									<EqualTab active data-tab="signup">
										<Link route="signup">
											<a onClick={e => e.preventDefault()}>Sign Up</a>
										</Link>
									</EqualTab>
								</div>
								<div className="ui bottom attached segment" data-tab="signup">
									<SwSignupForm onSignup={userDto => this.props.signup(userDto)} />
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
	checkUser(allowAnonymousOnly, 'home'),
	registerReducer({ auth: authReducer }),
	registerEpic(signupEpic),
	connect(null, { signup })
);

export default enhance(SwSignupPage);
