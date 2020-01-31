import React from 'react';
import { FilterOption } from '@web/shared/lib/ui/components/filter/FilterBar';
import { useLeagues } from '@web/shared/lib/react/hooks';
import { GetTeamsQuery, useGetTeamsLazyQuery } from '@web/graphql-generated';
import { SwStickyTable, SwTableCell, SwTableHeader, SwTableRow } from '@web/shared/lib/ui/components/table/Table';
import { SwStar } from '@web/shared/lib/ui/components/rating/Star';
import { SwSortableRow } from '@web/shared/lib/ui/components/table/SortableRow';
import { SortColumn, SwFilterList } from '@web/shared/lib/ui/components/filter/FilterList';

const SwTeamListComponent: React.FC<any> = () => {
	const leagues = useLeagues();
	const lazyQuery = useGetTeamsLazyQuery();
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
		<SwFilterList filterOptions={filterOptions} lazyQuery={lazyQuery}>
			{({ result, onSortColumnChange, sortColumn }) =>
				renderTeams({
					data: result,
					sortColumn,
					onChange: onSortColumnChange,
				})
			}
		</SwFilterList>
	);
};

function renderTeams({
	data,
	sortColumn,
	onChange,
}: {
	data: GetTeamsQuery;
	sortColumn: SortColumn;
	onChange: ({ column, asc }: SortColumn) => void;
}) {
	if (!data?.list?.items) {
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
			{data.list.items.map(team => (
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
