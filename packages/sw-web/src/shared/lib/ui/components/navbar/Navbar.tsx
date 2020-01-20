import React from 'react';
import { Icon, Input, Menu } from 'semantic-ui-react';
import { logout } from '@web/features/auth/store/actions';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { SwMenuItem } from '@web/shared/lib/ui/components/menu/MenuItem';
import { SwBigScreen } from '@web/shared/lib/ui/components/responsive/Responsive';

const NavbarMenu = styled(Menu)`
	&&&& {
		margin: 0;
		background-color: ${props => props.theme.colors.primary};
		border-radius: 0;
		position: fixed;
		width: 100%;
		z-index: 100;
		height: ${props => props.theme.dimen.navBar};

		.active.item {
			background-color: ${props => props.theme.colors.accent};
		}

		.sw-nav-title {
			display: none;
		}
	}
`;

interface IProps {
	onSidebarClicked: Function;
	logout: typeof logout;
}

export const SwNavBarComponent: React.FC<IProps> = function({ onSidebarClicked, children }) {
	return (
		<NavbarMenu inverted>
			<Menu.Item data-element-name={'sidebar-open'} onClick={() => onSidebarClicked()}>
				<Icon name="th" />
			</Menu.Item>
			<SwBigScreen>
				<SwMenuItem route={'home'} showActive={false}>
					<Icon name="soccer" />
					Sporty wide
				</SwMenuItem>
			</SwBigScreen>
			<SwMenuItem>
				<Input icon="search" placeholder="Search..." style={{ maxWidth: '300px' }} />
			</SwMenuItem>

			<SwBigScreen>
				<Menu.Menu position="right">{children}</Menu.Menu>
			</SwBigScreen>
		</NavbarMenu>
	);
};

export const SwNavBar = connect(null, {
	logout,
})(SwNavBarComponent);
