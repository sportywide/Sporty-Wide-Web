import React, { useContext, useEffect } from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { connect } from 'react-redux';
import { UserContext } from '@web/shared/lib/store';
import { compose } from '@shared/lib/utils/fp/combine';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { loadUserLeagueEpic } from '@web/features/leagues/user/store/epics';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { userLeagueReducer } from '@web/features/leagues/user/store/reducers/user-league-reducer';
import { SwLeague } from '@web/features/leagues/components/League';
import { loadUserLeagues } from '../store/actions';
import { SwLeagueContainer } from '@web/features/leagues/components/league.styled';

interface IProps {
	userLeagueMap?: { [key: number]: LeagueDto[] };
	loadUserLeagues: typeof loadUserLeagues;
}

const SwUserLeaguesComponent: React.FC<IProps> = ({ userLeagueMap = {}, loadUserLeagues }) => {
	const user = useContext(UserContext);
	const leagues = userLeagueMap[user.id] || [];
	useEffect(() => {
		loadUserLeagues(user.id);
	}, [loadUserLeagues, user.id]);
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

const enhancer = compose(
	registerEpic(loadUserLeagueEpic),
	registerReducer({ userLeagues: userLeagueReducer }),
	connect(
		state => ({
			userLeagueMap: state.userLeagues,
		}),
		{
			loadUserLeagues,
		}
	)
);

export const SwUserLeagues = enhancer(SwUserLeaguesComponent);
