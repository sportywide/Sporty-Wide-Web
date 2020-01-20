import styled, { css } from 'styled-components';
import { Container } from 'semantic-ui-react';
import { device } from '@web/styles/constants/size';

const swBackground = css`
	width: 100%;
	height: 100%;
	min-height: 100vh;
	@media ${device.tablet} {
		${({ padding }) =>
			padding &&
			`
			 padding-top: var(--space-1);
			 padding-bottom: var(--space-1);
		`}
	}
`;
export const SwPrimaryBackGround = styled.div`
	${swBackground};
	@media ${device.tablet} {
		background-color: ${props => props.theme.colors.primary};
	}
`;

export const SwGreyBackground = styled.div`
	${swBackground};
	@media ${device.tablet} {
		background-color: ${props => props.theme.colors.grey};
	}
`;

export const SwTransparentBackground = styled.div`
	${swBackground};
	background-color: ${props => props.theme.colors.transparent};
`;

export const SwFluidContainer = styled.div`
	width: 100%;
`;

export const SwContainer = styled(Container).attrs({ id: 'container' })`
	&&&&&&& {
		background-color: ${props => props.theme.colors.white};
		padding: var(--space-3);
		margin: 0;
		@media ${device.tablet} {
			margin: var(--space-3) auto;
			border-radius: 5px;
			box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.2);
		}
		min-height: calc(100vh - 2 * var(--space-3));
		position: relative;
		display: flex;
		flex-direction: column;
	}
`;

export const SwFullWidth = styled(Container)`
	&&& {
		width: 100%;
		height: 100%;
	}
`;
