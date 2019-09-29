import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { connect } from 'react-redux';
import { UserContext } from '@web/shared/lib/store';
import { compose } from '@shared/lib/utils/fp/combine';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { loadUserLeagueEpic } from '@web/features/leagues/user/store/epics';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { userLeagueReducer } from '@web/features/leagues/user/store/reducers/user-league-reducer';
import { SwLeague } from '@web/features/leagues/base/components/League';
import { SwLeagueContainer } from '@web/features/leagues/base/components/League.styled';
import { loadLeagues } from '@web/features/leagues/base/store/actions';
import { UserLeagueDto } from '@shared/lib/dtos/leagues/user-league.dto';
import { userLeagueSelector } from '@web/features/leagues/user/store/store/league.selectors';
import { loadUserLeagues } from '../store/actions';

interface IProps {
	leagues: (UserLeagueDto & { selected: boolean })[];
	loadUserLeagues: typeof loadUserLeagues;
	loadLeagues: typeof loadLeagues;
}

const SwUserLeaguesComponent: React.FC<IProps> = ({ leagues = [], loadUserLeagues, loadLeagues }) => {
	const user = useContext(UserContext);
	useEffect(() => {
		loadUserLeagues(user.id);
		loadLeagues();
	}, [loadLeagues, loadUserLeagues, user.id]);
	return (
		<Grid verticalAlign={'middle'} centered>
			{leagues.map(league => (
				<SwLeagueContainer key={league.name} mobile={8} tablet={4} computer={4}>
					<SwLeague league={league} />
				</SwLeagueContainer>
			))}
		</Grid>
	);
};
const leagueSelector = userLeagueSelector();
const enhancer = compose(
	registerEpic(loadUserLeagueEpic),
	registerReducer({ userLeagues: userLeagueReducer }),
	connect(
		state => ({
			leagues: leagueSelector(state)(state.auth.user && state.auth.user.id),
		}),
		{
			loadUserLeagues,
			loadLeagues,
		}
	)
);

export const SwUserLeagues = enhancer(SwUserLeaguesComponent);
