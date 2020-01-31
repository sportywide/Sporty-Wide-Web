import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FilterOption, SwFilterBar } from '@web/shared/lib/ui/components/filter/FilterBar';
import { SwPagination } from '@web/shared/lib/ui/components/filter/Pagination';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';
import { SwPaginationOptions } from '@web/shared/lib/ui/components/filter/PaginationOptions';
import { Debounce } from '@shared/lib/utils/functions/debounce';
import { ReactNode } from '@root/node_modules/@types/react';
import { QueryLazyOptions } from '@apollo/react-hooks';
import { QueryResult } from '@apollo/react-common';

export type SortColumn = {
	column?: string;
	asc?: boolean;
};

type FilterListResult<T> = {
	list: {
		items: T[];
		count: number;
	};
};

type FilterListArgs = {
	filter?: any;
	limit?: number;
	skip?: number;
	sort?: string;
	asc?: boolean;
};

interface IProps<TData> {
	filterOptions: FilterOption[];
	children: (args: {
		result: FilterListResult<TData>;
		onSortColumnChange?: (sortColumn: SortColumn) => void;
		sortColumn?: SortColumn;
	}) => ReactNode;
	lazyQuery: [
		(options?: QueryLazyOptions<FilterListArgs> | undefined) => void,
		QueryResult<FilterListResult<TData>, FilterListArgs>
	];
}

const SwFilterListComponent = <TData extends object>({ filterOptions, children, lazyQuery }: IProps<TData>) => {
	const fetchDebounce = useMemo(() => new Debounce(100), []);
	const [pageSize, setCurrentPageSize] = useState<number>(null);
	const [currentFilter, setCurrentFilter] = useState<any>({});
	const [activePage, setActivePage] = useState<number>(1);
	const [fetchAction, { loading, data }] = lazyQuery;
	const [sortColumn, setSortColumn] = useState<SortColumn>({
		column: null,
		asc: null,
	});
	const setActiveCallback = useCallback(activePage => setActivePage(activePage), []);

	useEffect(() => {
		fetchDebounce.run(() => {
			fetchAction({
				variables: {
					filter: currentFilter,
					limit: pageSize,
					skip: pageSize * (activePage - 1),
					sort: sortColumn.column,
					asc: sortColumn.asc,
				},
			});
		});
	}, [pageSize, currentFilter, activePage, sortColumn, fetchDebounce, fetchAction]);
	return (
		<div>
			<SwFilterBar
				filterOptions={filterOptions}
				onFilterBarChanged={currentFilter => {
					setActivePage(1);
					setCurrentFilter(currentFilter);
				}}
			/>
			{!!data?.list?.count && (
				<SwPagination
					pageSize={pageSize}
					activePage={activePage}
					total={data.list.count}
					onPageChanged={setActiveCallback}
				/>
			)}
			{loading && <Spinner portalRoot={'#container'} />}
			{!loading &&
				children({ result: data, onSortColumnChange: sortColumn => setSortColumn(sortColumn), sortColumn })}
			<SwPaginationOptions onPageSizeChanged={size => setCurrentPageSize(size)} />
		</div>
	);
};

export const SwFilterList = SwFilterListComponent;
