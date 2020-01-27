import styled from 'styled-components';
import { SwResponsiveSegment } from '@web/shared/lib/ui/components/responsive/Responsive';
import { device } from '@web/styles/constants/size';

export const SwFormSegment = styled(SwResponsiveSegment)`
	&&& {
		padding: var(--space-3) var(--space-2);

		@media ${device.tablet} {
			padding: var(--space-3) var(--space-3);
		}
	}
`;
