import React from 'react';
import { Link } from '@web/routes';
import { connect } from 'react-redux';
import { Button, Flag, Segment, Icon, Sidebar, Input, Menu } from 'semantic-ui-react';
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
import { allowActiveOnly, checkUser } from '@web/shared/lib/auth/check-user';
import { redirect } from '@web/shared/lib/navigation/helper';
import { GraphQlTest } from '@web/features/user/components/GraphqlTest';

function NavBar(props) {
	return (
		<Menu secondary>
			<Menu.Item onClick={props.handleSidebarClick()}>
				<Icon name="th" />
			</Menu.Item>
			<Menu.Item>
				<Icon name="soccer" />
				Sporty-wide
			</Menu.Item>
			<Menu.Item>
				<Input icon="search" placeholder="Search..." style={{ width: '300px' }} />
			</Menu.Item>

			<Menu.Menu position="right">
				<Menu.Item
					name="profile"
					active={props.activeItem === 'profile'}
					onClick={props.handleItemClick('profile')}
				>
					<Icon name="user circle" />
				</Menu.Item>
				<Menu.Item name="home" active={props.activeItem === 'home'} onClick={props.handleItemClick('home')}>
					<Icon name="home" />
				</Menu.Item>
				<Menu.Item
					name="messages"
					active={props.activeItem === 'messages'}
					onClick={props.handleItemClick('messages')}
				>
					<Icon name="conversation" />
				</Menu.Item>
				<Menu.Item
					name="notifications"
					active={props.activeItem === 'notifications'}
					onClick={props.handleItemClick('notifications')}
				>
					<Icon name="bell" />
				</Menu.Item>
				<Menu.Item
					name="help"
					active={props.activeItem === 'help'}
					onClick={e => props.handleItemClick('help')}
				>
					<Icon name="help" />
				</Menu.Item>
				<Menu.Item name="logout" active={props.activeItem === 'logout'} onClick={() => props.logout()}>
					<Icon name="log out" />
				</Menu.Item>
			</Menu.Menu>
		</Menu>
	);
}

interface IProps {
	startFetchingCharacters: Function;
	stopFetchingCharacters: Function;
	logout: Function;
	user: IUser;
	isServer: boolean;
}

class SwIndex extends React.Component<IProps, any> {
	constructor(props: Readonly<IProps>) {
		super(props);
		this.state = { activeItem: 'home', sidebarVisible: false };
	}

	static async getInitialProps({ store, isServer }) {
		const resultAction = await fetchCharacter(1, isServer).toPromise(); // we need to convert observable to Promise
		store.dispatch(resultAction);

		return { isServer };
	}

	handleItemClick = (e, { name }) => this.setState({ activeItem: name });
	handleSidebarClick = () => this.setState({ sidebarVisible: !this.state.sidebarVisible });

	componentDidMount() {
		this.props.startFetchingCharacters();
	}

	componentWillUnmount() {
		this.props.stopFetchingCharacters();
	}

	render() {
		return (
			<Sidebar.Pushable as={Segment} style={{ margin: 0, 'min-height': '100vh' }}>
				<Sidebar
					as={Menu}
					animation="push"
					icon="labeled"
					inverted
					vertical
					visible={this.state.sidebarVisible}
					width="thin"
				>
					<Menu.Item as="a">
						<Icon name="home" />
						Home
					</Menu.Item>
					<Menu.Item as="a">
						<Icon name="line graph" />
						Trending
					</Menu.Item>
					<Menu.Item as="a">
						<Icon name="soccer" />
						Teams
					</Menu.Item>
				</Sidebar>
				<Sidebar.Pusher>
					<Segment basic>
						<NavBar
							handleItemClick={name => this.handleItemClick}
							handleSidebarClick={() => this.handleSidebarClick}
							activeItem={this.state.activeItem}
							logout={() => this.props.logout()}
						/>
					</Segment>
				</Sidebar.Pusher>
			</Sidebar.Pushable>
		);
	}
}

const enhance = compose(
	checkUser(allowActiveOnly),
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

export default enhance(SwIndex);
