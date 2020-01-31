import React from 'react';
import { Pagination } from 'semantic-ui-react';

interface IProps {
	pageSize: number;
	activePage: number;
	total: number;
	onPageChanged: (page: number) => void;
}
const SwPaginationComponent: React.FC<IProps> = ({ onPageChanged, pageSize, total, activePage }) => {
	const totalPages = Math.ceil(total / pageSize);
	return (
		<div className={'sw-flex sw-flex-center sw-mt1 sw-mb2 sw-flex-wrap'}>
			<span className={'sw-ml1 sw-mb1 sw-mr2'}>
				{(activePage - 1) * pageSize + 1} - {Math.min(activePage * pageSize, total)} of {total}
			</span>
			<div className={'sw-tablet-flex-float-right sw-mb1'}>
				<Pagination
					activePage={activePage}
					boundaryRange={1}
					siblingRange={1}
					onPageChange={(e, { activePage }) => onPageChanged(activePage as number)}
					size="mini"
					totalPages={totalPages}
					ellipsisItem={undefined}
					firstItem={undefined}
					lastItem={undefined}
					prevItem={null}
					nextItem={null}
				/>
			</div>
		</div>
	);
};

export const SwPagination = SwPaginationComponent;
