import React from 'react';
import { FilterOption, SwFilterBar } from '@web/shared/lib/ui/components/filter/FilterBar';
import { useEffectOnce, useLeagues } from '@web/shared/lib/react/hooks';
import { GetTeamsQuery, useGetTeamsLazyQuery } from '@web/graphql-generated';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';
import { StickyTable, TableCell, TableHeader, TableRow } from '@web/shared/lib/ui/components/table/Table';

const SwTeamListComponent: React.FC<any> = () => {
	const leagues = useLeagues();
	const [fetchTeams, { loading, data }] = useGetTeamsLazyQuery();
	useEffectOnce(() => {
		fetchTeams();
	});
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
					fetchTeams({
						variables: {
							filter: currentFilter,
						},
					});
				}}
			/>
			{loading && <Spinner portalRoot={'#container'} />}
			{!loading && renderTeams(data)}
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
			{data.teams.map(team => (
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
