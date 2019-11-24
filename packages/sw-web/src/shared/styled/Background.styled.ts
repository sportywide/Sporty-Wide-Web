import styled, { css } from 'styled-components';
import { Container } from 'semantic-ui-react';

const swBackground = css`
	width: 100%;
	height: 100%;
	min-height: 100vh;
`;
export const SwPrimaryBackGround = styled.div`
	${swBackground};
	background-color: ${props => props.theme.colors.primary};
`;

export const SwGreyBackground = styled.div`
	${swBackground};
	background-color: ${props => props.theme.colors.grey};

	${({ padding }) =>
		padding &&
		`
			 padding-top: var(--space-1);
			 padding-bottom: var(--space-1);
		`}
`;

export const SwTransparentBackground = styled.div`
	${swBackground};
	background-color: ${props => props.theme.colors.transparent};
`;

export const SwFluidContainer = styled.div`
	width: 100%;
`;

export const SwContainer = styled(Container)`
	&&& {
		background-color: ${props => props.theme.colors.white};
		padding: var(--space-3);
		margin: var(--space-3) 0;
		min-height: calc(100vh - 2 * var(--space-3));
		border-radius: 5px;
		box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.2);
		position: relative;
	}
`;
