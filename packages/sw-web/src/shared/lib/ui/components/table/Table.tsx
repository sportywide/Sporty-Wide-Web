import styled from 'styled-components';
import * as ReactStickyTable from 'react-sticky-table';

export const StickyTable = styled(ReactStickyTable.StickyTable)`
	&&&& {
		overflow-x: hidden;
		overflow-y: hidden;

		&:hover {
			overflow-x: overlay;
		}

		.sticky-table-table {
			width: 100%;
		}
	}
`;

export const TableCell = ReactStickyTable.Cell;
export const TableRow = ReactStickyTable.Row;
export const TableHeader = styled(ReactStickyTable.Cell)`
	font-weight: 700;
`;
