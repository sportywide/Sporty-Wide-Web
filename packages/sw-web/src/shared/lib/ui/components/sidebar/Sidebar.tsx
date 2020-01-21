import React, { useRef } from 'react';
import { Menu, Sidebar } from 'semantic-ui-react';
import { SwNavBar } from '@web/shared/lib/ui/components/navbar/Navbar';
import { logout } from '@web/features/auth/store/actions';
import { connect } from 'react-redux';
import { SwMenuItem } from '@web/shared/lib/ui/components/menu/MenuItem';
import { useApp, useEffectOnce, useStateRef } from '@web/shared/lib/react/hooks';
import { SwMobile } from '@web/shared/lib/ui/components/responsive/Responsive';
import * as S from './Sidebar.styled';

export function SwSideBarComponent({ logout, children }) {
	const [getSideBarVisible, setSidebarVisible] = useStateRef(false);
	const sideBarRef = useRef<any>();
	const app = useApp();
	useEffectOnce(() => {
		const clickDisposal = app.onWindowClick((eventType, e: MouseEvent) => {
			if (!getSideBarVisible()) {
				return;
			}
			const sideBarDiv: HTMLElement = sideBarRef.current?.ref?.current;
			const targetNode = e.target as HTMLElement;
			if (
				!sideBarDiv ||
				sideBarDiv.contains(targetNode) ||
				targetNode.closest('[data-element-name=sidebar-open]')
			) {
				return;
			}
			setSidebarVisible(false);
		});
		const eventDisposal = app.onSideBarClosed(() => {
			setSidebarVisible(false);
		});

		return () => {
			clickDisposal();
			eventDisposal();
		};
	});
	return (
		<S.SidebarPushable as={S.SidebarSegment} className={'sw-full-screen-height'}>
			<Sidebar
				ref={sideBarRef}
				as={Menu}
				animation="overlay"
				inverted
				vertical
				width="thin"
				visible={getSideBarVisible()}
			>
				<SwMenuItem>
					Community
					<Menu.Menu>
						<SwMenuItem as="a">
							<S.MenuIcon name="time" />
							Forum
						</SwMenuItem>
						<SwMenuItem as="a">
							<S.MenuIcon name="flag outline" />
							Market
						</SwMenuItem>
					</Menu.Menu>
				</SwMenuItem>
				<SwMenuItem>
					Soccer
					<Menu.Menu>
						<SwMenuItem as="a">
							<S.MenuIcon name="time" />
							Live Score
						</SwMenuItem>
						<SwMenuItem as="a" route={'user-leagues'}>
							<S.MenuIcon name="flag outline" />
							Leagues
						</SwMenuItem>
						<SwMenuItem as="a">
							<S.MenuIcon name="users" />
							Teams
						</SwMenuItem>
						<SwMenuItem as="a">
							<S.MenuIcon name="user" />
							Players
						</SwMenuItem>
					</Menu.Menu>
				</SwMenuItem>
				<SwMobile>
					<SwMenuItem>
						Navigation
						<Menu.Menu>{navbarItems()}</Menu.Menu>
					</SwMenuItem>
				</SwMobile>
			</Sidebar>
			<Sidebar.Pusher>
				<SwNavBar
					logout={() => logout()}
					onSidebarClicked={() => {
						setSidebarVisible(true);
					}}
				>
					{navbarItems()}
				</SwNavBar>
				{children}
			</Sidebar.Pusher>
		</S.SidebarPushable>
	);

	function navbarItems() {
		return (
			<>
				<SwMenuItem name="home" route={'home'}>
					<S.MenuIcon name="home" />
					<span className={'sw-nav-title'}>Home</span>
				</SwMenuItem>
				<SwMenuItem name="profile" route={'profile-edit'}>
					<S.MenuIcon name="user circle" />
					<span className={'sw-nav-title'}>Profile</span>
				</SwMenuItem>
				<SwMenuItem name="messages">
					<S.MenuIcon name="conversation" />
					<span className={'sw-nav-title'}>Messages</span>
				</SwMenuItem>
				<SwMenuItem name="notifications">
					<S.MenuIcon name="bell" />
					<span className={'sw-nav-title'}>Notifications</span>
				</SwMenuItem>
				<SwMenuItem name="help">
					<S.MenuIcon name="help" />
					<span className={'sw-nav-title'}>Help</span>
				</SwMenuItem>
				<SwMenuItem name="logout" onClick={() => logout()}>
					<S.MenuIcon name="log out" />
					<span className={'sw-nav-title'}>Log out</span>
				</SwMenuItem>
			</>
		);
	}
}

export const SwSideBar = connect(null, {
	logout,
})(SwSideBarComponent);
