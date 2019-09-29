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
