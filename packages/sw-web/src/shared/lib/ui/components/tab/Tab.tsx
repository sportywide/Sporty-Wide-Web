import React from 'react';
import { Tab } from 'semantic-ui-react';
import styled from 'styled-components';

const TabWrapper = styled(Tab)`
	&&& {
		.ui.menu::-webkit-scrollbar {
			display: none;
		}

		.ui.menu .item {
			border-bottom-color: rgba(34, 36, 38, 0.15);
			margin-bottom: 0;

			&.active {
				border-bottom-color: currentColor;
				&:after {
					display: none;
				}
			}
		}

		.ui.menu {
			overflow-x: auto;
			overflow-y: visible;
			border-bottom: none;
		}
	}
`;
export const SwTab = function(props) {
	return <TabWrapper {...props} />;
};
