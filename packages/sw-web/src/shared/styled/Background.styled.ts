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
		padding: var(--space-2);
		margin-top: var(--space-2);
	}
`;
