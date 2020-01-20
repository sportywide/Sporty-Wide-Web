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
			 opacity: 0.4;
		`}

	${({ canDrag }) =>
		!canDrag &&
		`
			img {
				user-drag: none; 
				user-select: none;
			}
		`}
`;

export const SwPlayerCircleAvatar = styled(Image)`
	&&& {
		width: 60px !important;
		height: 60px !important;
	}
`;

export const SwPlayerCircleName = styled.div`
	max-width: 80px;
	word-break: break-word;
	text-align: center;
	color: #000;
	background: #fff;
	padding: 0px 2px;
	opacity: 1;
	box-shadow: 0 0 2px 1px #111;
	border-radius: 3px;
	white-space: nowrap;
	font-size: 11px;
`;
