import React, { useEffect, useState } from 'react';
import { FilterOption, SwFilterBar } from '@web/shared/lib/ui/components/filter/FilterBar';
import { useLeagues } from '@web/shared/lib/react/hooks';
import { GetTeamsQuery, useGetTeamsLazyQuery } from '@web/graphql-generated';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';
import { StickyTable, TableCell, TableHeader, TableRow } from '@web/shared/lib/ui/components/table/Table';
import { SwPaginationOptions } from '@web/shared/lib/ui/components/filter/PaginationOptions';
import { SwPagination } from '@web/shared/lib/ui/components/filter/Pagination';

const SwTeamListComponent: React.FC<any> = () => {
	const leagues = useLeagues();
	const [pageSize, setCurrentPageSize] = useState(null);
	const [currentFilter, setCurrentFilter] = useState({});
	const [activePage, setActivePage] = useState(1);
	const [fetchTeams, { loading, data }] = useGetTeamsLazyQuery();
	useEffect(() => {
		fetchTeams({
			variables: {
				filter: currentFilter,
				limit: pageSize,
				skip: pageSize * (activePage - 1),
			},
		});
	}, [pageSize, currentFilter, fetchTeams, activePage]);
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
			{!loading && renderTeams(data)}
			<SwPaginationOptions onPageSizeChanged={size => setCurrentPageSize(size)} />
		</div>
	);
};

function renderTeams(data: GetTeamsQuery) {
	if (!(data && data.teams)) {
		return null;
	}
	return (
		<StickyTable>
			<TableRow>
				<TableHeader>Name</TableHeader>
				<TableHeader>League</TableHeader>
				<TableHeader>Overall</TableHeader>
				<TableHeader>Attack</TableHeader>
				<TableHeader>Midfield</TableHeader>
				<TableHeader>Defence</TableHeader>
				<TableHeader>Rating</TableHeader>
			</TableRow>
			{data.teams.items.map(team => (
				<TableRow key={team.id}>
					<TableCell>{team.title}</TableCell>
					<TableCell>{team.league}</TableCell>
					<TableCell>{team.ovr}</TableCell>
					<TableCell>{team.att}</TableCell>
					<TableCell>{team.mid}</TableCell>
					<TableCell>{team.def}</TableCell>
					<TableCell>{team.rating}</TableCell>
				</TableRow>
			))}
		</StickyTable>
	);
}
export const SwTeamList = SwTeamListComponent;
