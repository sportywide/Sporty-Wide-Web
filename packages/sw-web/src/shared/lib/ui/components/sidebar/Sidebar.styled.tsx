import styled from 'styled-components';
import { Icon, Segment, Sidebar } from 'semantic-ui-react';

export const SidebarSegment = styled(Segment)`
	&&&& {
		margin: 0;
		padding: 0;
		border-radius: 0;
		box-shadow: none;
		border: none;
		box-shadow: 0 3px 2px -2px rgba(34, 36, 38, 0.15);

		.item {
			text-align: left;
		}
	}
`;

export const SidebarPushable = styled(Sidebar.Pushable)`
	.pushable:not(body) {
		transform: none;
	}

	.pushable:not(body) > .ui.sidebar,
	.pushable:not(body) > .fixed,
	.pushable:not(body) > .pusher:after {
		position: fixed;
	}
`;

export const MenuIcon = styled(Icon)`
	&&&&&&&& {
		display: inline-block;
		font-size: 1.1em !important;
		float: none;
		margin: 0em 0.35714286em 0em 0em;
	}
`;
