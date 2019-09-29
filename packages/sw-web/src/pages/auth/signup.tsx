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
				<SwPrimaryBackGround>
					<Container style={{ width: '100%' }} className="ub-py4">
						<Grid verticalAlign={'middle'} centered>
							<GridColumn mobile={14} tablet={8} computer={6}>
								<div className="ui top attached tabular menu">
									<Link route="login">
										<a className="item" data-tab="login">
											Login
										</a>
									</Link>
									<Link route="signup">
										<a className="item active" data-tab="signup" onClick={e => e.preventDefault()}>
											Signup
										</a>
									</Link>
								</div>
								<div className="ui bottom attached segment" data-tab="signup">
									<SwSignupForm onSignup={userDto => this.props.signup(userDto)} />
									<div className="ui horizontal divider">or</div>
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
	connect(
		null,
		{ signup }
	)
);

export default enhance(SwSignupPage);
