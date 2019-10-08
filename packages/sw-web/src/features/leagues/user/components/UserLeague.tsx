import React, { memo, useCallback, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose } from '@shared/lib/utils/fp/combine';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { joinUserLeagueEpic, leaveUserLeagueEpic, fetchUserLeagueEpic } from '@web/features/leagues/user/store/epics';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { userLeagueReducer } from '@web/features/leagues/user/store/reducers/user-league-reducer';
import { SwLeague } from '@web/features/leagues/base/components/League';
import { SwLeagueContainer } from '@web/features/leagues/base/components/League.styled';
import { fetchLeagues } from '@web/features/leagues/base/store/actions';
import { SelectableLeagueDto } from '@shared/lib/dtos/leagues/user-league.dto';
import { userLeagueSelector } from '@web/features/leagues/user/store/store/league.selectors';
import { useUser } from '@web/shared/lib/react/hooks';
import { joinUserLeague, leaveUserLeague, fetchUserLeagues } from '../store/actions';

interface IProps {
	leagues: SelectableLeagueDto[];
	fetchUserLeagues: typeof fetchUserLeagues;
	fetchLeagues: typeof fetchLeagues;
	joinUserLeague: typeof joinUserLeague;
	leaveUserLeague: typeof leaveUserLeague;
}

const SwUserLeaguesComponent: React.FC<IProps> = ({
	leagues = [],
	fetchUserLeagues,
	fetchLeagues,
	joinUserLeague,
	leaveUserLeague,
}) => {
	const user = useUser();
	useEffect(() => {
		fetchUserLeagues(user.id);
		fetchLeagues();
	}, [fetchLeagues, fetchUserLeagues, user.id]);
	const onSelectCallback = useCallback(onSelect, []);
	return (
		<Grid verticalAlign={'middle'} centered>
			{leagues.map(league => (
				<SwLeagueContainer key={league.name} mobile={8} tablet={4} computer={4}>
					<SwLeague league={league} onSelect={onSelectCallback} />
				</SwLeagueContainer>
			))}
		</Grid>
	);

	function onSelect(leagueDto: SelectableLeagueDto) {
		if (leagueDto.selected) {
			leaveUserLeague({ leagueId: leagueDto.id, userId: user.id });
		} else {
			joinUserLeague({ leagueId: leagueDto.id, userId: user.id });
		}
	}
};
const leagueSelector = userLeagueSelector();
const enhancer = compose(
	registerEpic(fetchUserLeagueEpic, leaveUserLeagueEpic, joinUserLeagueEpic),
	registerReducer({ userLeagues: userLeagueReducer }),
	connect(
		state => ({
			leagues: leagueSelector(state)(state.auth.user && state.auth.user.id),
		}),
		{
			fetchUserLeagues,
			fetchLeagues,
			leaveUserLeague,
			joinUserLeague,
		}
	),
	memo
);

export const SwUserLeagues = enhancer(SwUserLeaguesComponent);
