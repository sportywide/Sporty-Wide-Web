import React, { useEffect, useState } from 'react';
import { FilterOption, SwFilterBar } from '@web/shared/lib/ui/components/filter/FilterBar';
import { useLeagues } from '@web/shared/lib/react/hooks';
import { GetTeamsQuery, useGetTeamsLazyQuery } from '@web/graphql-generated';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';
import { SwStickyTable, SwTableCell, SwTableHeader, SwTableRow } from '@web/shared/lib/ui/components/table/Table';
import { SwPaginationOptions } from '@web/shared/lib/ui/components/filter/PaginationOptions';
import { SwPagination } from '@web/shared/lib/ui/components/filter/Pagination';
import { SwStar } from '@web/shared/lib/ui/components/rating/Star';
import { SwSortableRow } from '@web/shared/lib/ui/components/table/SortableRow';

const SwTeamListComponent: React.FC<any> = () => {
	const leagues = useLeagues();
	const [pageSize, setCurrentPageSize] = useState(null);
	const [currentFilter, setCurrentFilter] = useState({});
	const [activePage, setActivePage] = useState(1);
	const [fetchTeams, { loading, data }] = useGetTeamsLazyQuery();
	const [sortColumn, setSortColumn] = useState({
		column: null,
		asc: null,
	});

	useEffect(() => {
		fetchTeams({
			variables: {
				filter: currentFilter,
				limit: pageSize,
				skip: pageSize * (activePage - 1),
				sort: sortColumn.column,
				asc: sortColumn.asc,
			},
		});
	}, [pageSize, currentFilter, fetchTeams, activePage, sortColumn]);
	if (!leagues) {
		return null;
	}
	const filterOptions: FilterOption[] = [
		{
			name: 'leagueId',
			type: 'multi_select',
			options: leagues.map(league => ({ text: league.title, value: league.id })),
			placeholder: 'League',
		},
		{
			name: 'search',
			type: 'search',
			right: true,
			placeholder: 'Enter search query',
		},
	];

	return (
		<div>
			<SwFilterBar
				filterOptions={filterOptions}
				onFilterBarChanged={currentFilter => {
					setCurrentFilter(currentFilter);
				}}
			/>
			{data?.teams?.count && (
				<SwPagination
					pageSize={pageSize}
					activePage={activePage}
					total={data.teams.count}
					onPageChanged={activePage => setActivePage(activePage)}
				/>
			)}
			{loading && <Spinner portalRoot={'#container'} />}
			{!loading &&
				renderTeams({
					data,
					sortColumn,
					onChange: ({ column, asc }) => {
						setSortColumn({
							column,
							asc,
						});
					},
				})}
			<SwPaginationOptions onPageSizeChanged={size => setCurrentPageSize(size)} />
		</div>
	);
};

function renderTeams({
	data,
	sortColumn,
	onChange,
}: {
	data: GetTeamsQuery;
	sortColumn: { column: string; asc: boolean };
	onChange: ({ column, asc }: { column: string; asc: boolean }) => void;
}) {
	if (!(data && data.teams)) {
		return null;
	}
	return (
		<SwStickyTable>
			<SwSortableRow asc={sortColumn.asc} column={sortColumn.column} onChange={onChange}>
				<SwTableHeader sortable name={'name'}>
					Name
				</SwTableHeader>
				<SwTableHeader sortable name={'league'}>
					League
				</SwTableHeader>
				<SwTableHeader sortable name={'ovr'}>
					Overall
				</SwTableHeader>
				<SwTableHeader sortable name={'att'}>
					Attack
				</SwTableHeader>
				<SwTableHeader sortable name={'mid'}>
					Midfield
				</SwTableHeader>
				<SwTableHeader sortable name={'def'}>
					Defence
				</SwTableHeader>
				<SwTableHeader sortable name={'rating'}>
					Rating
				</SwTableHeader>
			</SwSortableRow>
			{data.teams.items.map(team => (
				<SwTableRow key={team.id}>
					<SwTableCell>{team.title}</SwTableCell>
					<SwTableCell>{team.league}</SwTableCell>
					<SwTableCell>{team.ovr}</SwTableCell>
					<SwTableCell>{team.att}</SwTableCell>
					<SwTableCell>{team.mid}</SwTableCell>
					<SwTableCell>{team.def}</SwTableCell>
					<SwTableCell>
						<SwStar value={getStars(team.rating)} readonly={true} />
					</SwTableCell>
				</SwTableRow>
			))}
		</SwStickyTable>
	);
}
function getStars(rating) {
	return parseFloat(rating.split('/')[0]);
}
export const SwTeamList = SwTeamListComponent;
