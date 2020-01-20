import React from 'react';
import { Icon, Input, Menu, Sidebar } from 'semantic-ui-react';
import { logout } from '@web/features/auth/store/actions';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { SwMenuItem } from '@web/shared/lib/ui/components/menu/MenuItem';

const NavbarMenu = styled(Menu)`
	&&&& {
		margin: 0;
		background-color: ${props => props.theme.colors.primary};
		border-radius: 0;

		.active.item {
			background-color: ${props => props.theme.colors.accent};
		}
	}
`;

interface IProps {
	onSidebarClicked: Function;
	logout: typeof logout;
}

export const SwNavBarComponent: React.FC<IProps> = function({ onSidebarClicked, children, logout }) {
	return (
		<Sidebar.Pusher>
			<NavbarMenu inverted>
				<Menu.Item data-element-name={'sidebar-open'} onClick={() => onSidebarClicked()}>
					<Icon name="th" />
				</Menu.Item>
				<SwMenuItem route={'home'} showActive={false}>
					<Icon name="soccer" />
					Sporty wide
				</SwMenuItem>
				<SwMenuItem>
					<Input icon="search" placeholder="Search..." style={{ width: '300px' }} />
				</SwMenuItem>

				<Menu.Menu position="right">
					<SwMenuItem name="home" route={'home'}>
						<Icon name="home" />
					</SwMenuItem>
					<SwMenuItem name="profile" route={'profile-edit'}>
						<Icon name="user circle" />
					</SwMenuItem>
					<SwMenuItem name="messages">
						<Icon name="conversation" />
					</SwMenuItem>
					<SwMenuItem name="notifications">
						<Icon name="bell" />
					</SwMenuItem>
					<SwMenuItem name="help">
						<Icon name="help" />
					</SwMenuItem>
					<SwMenuItem name="logout" onClick={() => logout()}>
						<Icon name="log out" />
					</SwMenuItem>
				</Menu.Menu>
			</NavbarMenu>
			{children}
		</Sidebar.Pusher>
	);
};

export const SwNavBar = connect(null, {
	logout,
})(SwNavBarComponent);
