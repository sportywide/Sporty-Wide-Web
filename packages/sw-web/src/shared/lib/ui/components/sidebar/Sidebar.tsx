import React, { useState } from 'react';
import { Segment, Menu, Icon, Sidebar } from 'semantic-ui-react';
import { SwNavBar } from '@web/shared/lib/ui/components/navbar/Navbar';
import { logout } from '@web/features/auth/store/actions';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SwMenuItem } from '@web/shared/lib/ui/components/menu/MenuItem';

const SidebarSegment = styled(Segment)`
	&&&& {
		margin: 0;
		border-radius: 0;
		box-shadow: none;
		border: none;
		box-shadow: 0 3px 2px -2px rgba(34, 36, 38, 0.15);

		.item {
			text-align: left;
		}
	}
`;

const MenuIcon = styled(Icon)`
	&&&&&&&& {
		display: inline-block;
		font-size: 1.1em !important;
		float: none;
		margin: 0em 0.35714286em 0em 0em;
	}
`;

export function SwSideBarComponent({ logout, children }) {
	const [sidebarVisible, setSidebarVisible] = useState(false);
	return (
		<Sidebar.Pushable as={SidebarSegment} className={'sw-full-screen-height'}>
			<Sidebar as={Menu} animation="push" inverted vertical width="thin" visible={sidebarVisible}>
				<SwMenuItem>
					Community
					<Menu.Menu>
						<SwMenuItem as="a">
							<MenuIcon name="time" />
							Forum
						</SwMenuItem>
						<SwMenuItem as="a">
							<MenuIcon name="flag outline" />
							Market
						</SwMenuItem>
					</Menu.Menu>
				</SwMenuItem>
				<SwMenuItem>
					Soccer
					<Menu.Menu>
						<SwMenuItem as="a">
							<MenuIcon name="time" />
							Live Score
						</SwMenuItem>
						<SwMenuItem as="a" route={'user-leagues'}>
							<MenuIcon name="flag outline" />
							Leagues
						</SwMenuItem>
						<SwMenuItem as="a">
							<MenuIcon name="users" />
							Teams
						</SwMenuItem>
						<SwMenuItem as="a">
							<MenuIcon name="user" />
							Players
						</SwMenuItem>
					</Menu.Menu>
				</SwMenuItem>
			</Sidebar>
			<SwNavBar
				logout={() => logout()}
				onSidebarClicked={() => {
					setSidebarVisible(!sidebarVisible);
				}}
			>
				{children}
			</SwNavBar>
		</Sidebar.Pushable>
	);
}

export const SwSideBar = connect(null, {
	logout,
})(SwSideBarComponent);
