import styled from 'styled-components';
import { Image, Label } from 'semantic-ui-react';

export const SwDraggablePlayer = styled.div`
	display: flex;
	cursor: pointer;
	opacity: 1;

	${({ isDragging }) =>
		isDragging &&
		`
			opacity: 0.4;
		`}

	${({ canDrag }) =>
		!canDrag &&
		`
			opacity: 0.4;
			img {
				user-drag: none; 
				user-select: none;
				-moz-user-select: none;
				-webkit-user-drag: none;
				-webkit-user-select: none;
				-ms-user-select: none;
			}
		`}
`;

export const SwStatsLabel = styled(Label)`
	&&& {
		margin-right: 10px;
		width: 2.1em;
		height: 2.1em;
	}
`;

export const SwTeamLogo = styled(Image)`
	&&& {
		width: 50px;
		height: 50px;
	}
`;

export const SwPlayerLogo = styled(Image)`
	&&& {
		width: 50px;
		height: 50px;
	}
`;
