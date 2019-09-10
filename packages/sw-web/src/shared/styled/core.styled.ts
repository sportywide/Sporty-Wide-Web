import styled, { css } from 'styled-components';

const swBackground = css`
	width: 100%;
	height: 100%;
`;
export const SwPrimaryBackGround = styled.div`
	${swBackground};
	background-color: ${props => props.theme.colors.primary};
`;

export const SwGreyBackground = styled.div`
	${swBackground};
	background-color: ${props => props.theme.colors.grey};
`;

export const SwContainer = styled.div`
	width: 100%;
`;
