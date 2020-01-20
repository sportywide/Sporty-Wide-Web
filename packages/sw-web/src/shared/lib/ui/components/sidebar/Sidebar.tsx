import React, { useRef } from 'react';
import { Menu, Sidebar } from 'semantic-ui-react';
import { SwNavBar } from '@web/shared/lib/ui/components/navbar/Navbar';
import { logout } from '@web/features/auth/store/actions';
import { connect } from 'react-redux';
import { SwMenuItem } from '@web/shared/lib/ui/components/menu/MenuItem';
import { useApp, useStateRef, useEffectOnce } from '@web/shared/lib/react/hooks';
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
			</Sidebar>
			<SwNavBar
				logout={() => logout()}
				onSidebarClicked={() => {
					setSidebarVisible(true);
				}}
			>
				{children}
			</SwNavBar>
		</S.SidebarPushable>
	);
}

export const SwSideBar = connect(null, {
	logout,
})(SwSideBarComponent);
