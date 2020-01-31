import styled from 'styled-components';
import * as ReactStickyTable from 'react-sticky-table';

export const SwStickyTable = styled(ReactStickyTable.StickyTable)`
	&&&& {
		overflow-x: hidden;
		overflow-y: hidden;

		&:hover {
			overflow-x: overlay;
		}

		.sticky-table-table {
			width: 100%;
		}

		&::-webkit-scrollbar {
			display: none;
		}
		-ms-overflow-style: none;
	}
`;

export const SwTableCell = ReactStickyTable.Cell;
export const SwTableRow = ReactStickyTable.Row;
export const SwTableHeader = styled(ReactStickyTable.Cell)`
	font-weight: 700;
`;
