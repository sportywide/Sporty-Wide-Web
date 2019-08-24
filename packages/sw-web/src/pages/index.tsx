import React from 'react';
import { Link } from '@web/routes';
import { connect } from 'react-redux';
import { Button, Flag, Segment } from 'semantic-ui-react';
import { CharacterInfo } from '@web/features/home/components';
import { fetchCharacter } from '@web/features/home/services/character.service';
import { startFetchingCharacters, stopFetchingCharacters } from '@web/features/home/store/actions';
import { compose } from 'recompose';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { reducer as homeReducer } from '@web/features/home/store/reducers';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { fetchUserEpic } from '@web/features/home/store/epics';
import Head from 'next/head';
import { logout } from '@web/features/auth/store/actions';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { checkUser, hasUser } from '@web/shared/lib/auth/check-user';

interface IProps {
	startFetchingCharacters: Function;
	stopFetchingCharacters: Function;
	logout: Function;
	user: IUser;
}

class Counter extends React.Component<IProps, any> {
	static async getInitialProps({ store, isServer }) {
		const resultAction = await fetchCharacter(1, isServer).toPromise(); // we need to convert observable to Promise
		store.dispatch(resultAction);

		return { isServer };
	}

	componentDidMount() {
		this.props.startFetchingCharacters();
	}

	componentWillUnmount() {
		this.props.stopFetchingCharacters();
	}

	render() {
		return (
			<div className="ub-p4">
				<Head>
					<title>SportyWide</title>
				</Head>
				{this.props.user && (
					<div className="ub-mb1">
						<h5>Current user</h5>
						<div>Email: {this.props.user.email}</div>
						<div>Name: {this.props.user.name}</div>
					</div>
				)}
				<Button onClick={() => this.props.logout()}>Logout</Button>
				<h1>Index Page</h1>
				<CharacterInfo />
				<Segment>
					<Flag name="ae" />
					<Flag name="france" />
					<Flag name="myanmar" />
					<Button primary>Test semantic</Button>
				</Segment>
				<br />
				<nav>
					<Link route="/other">
						<a>Navigates to &quot;/other&quot;</a>
					</Link>
				</nav>
			</div>
		);
	}
}

const enhance = compose(
	//TODO: remove once we implement user verification
	checkUser(hasUser),
	registerReducer({ home: homeReducer }),
	registerEpic(fetchUserEpic),
	connect(
		state => ({ user: state.auth.user }),
		{
			startFetchingCharacters,
			stopFetchingCharacters,
			logout,
		}
	)
);

export default enhance(Counter);
