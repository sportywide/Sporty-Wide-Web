import styled from 'styled-components';
import { Image } from 'semantic-ui-react';

export const SwPlayerCircle = styled.div`
	position: absolute !important;
	display: flex;
	flex-direction: column;
	align-items: center;
	transform: translate(-50%, -50%);

	${({ isDragging }) =>
		isDragging &&
		`
			 opacity: 0.4,
		`}
`;

export const SwPlayerCircleAvatar = styled(Image)`
	&&& {
		width: 60px !important;
		height: 60px !important;
	}
`;

export const SwPlayerCircleName = styled.div`
	color: black;
	font-weight: 700;
`;
