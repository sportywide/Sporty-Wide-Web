import React, { memo, useCallback, useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose } from '@shared/lib/utils/fp/combine';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { fetchUserLeagueEpic, leaveUserLeagueEpic } from '@web/features/leagues/user/store/epics';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { userLeagueReducer } from '@web/features/leagues/user/store/reducers/user-league-reducer';
import { SwLeague } from '@web/features/leagues/base/components/League';
import { SwLeagueContainer } from '@web/features/leagues/base/components/League.styled';
import { fetchLeagues } from '@web/features/leagues/base/store/actions';
import { SelectableLeagueDto } from '@shared/lib/dtos/leagues/user-league.dto';
import { userLeagueSelector } from '@web/features/leagues/user/store/store/league.selectors';
import { useUser } from '@web/shared/lib/react/hooks';
import { ContainerContext } from '@web/shared/lib/store';
import { SHOW_LEAGUE_PREFERENCE } from '@web/shared/lib/popup/modal.constants';
import { redirect } from '@web/shared/lib/navigation/helper';
import { Spinner } from '@web/shared/lib/ui/components/loading/Spinner';
import { SwApp } from '@web/shared/lib/app';
import { fetchUserLeagues, leaveUserLeague } from '../store/actions';

interface IProps {
	leagues: SelectableLeagueDto[];
	fetchUserLeagues: typeof fetchUserLeagues;
	fetchLeagues: typeof fetchLeagues;
	leaveUserLeague: typeof leaveUserLeague;
}

const SwUserLeaguesComponent: React.FC<IProps> = ({ leagues, fetchUserLeagues, fetchLeagues, leaveUserLeague }) => {
	const user = useUser();
	const container = useContext(ContainerContext);
	useEffect(() => {
		fetchUserLeagues(user.id);
		fetchLeagues();
	}, [fetchLeagues, fetchUserLeagues, user.id]);
	const onPlayCallback = useCallback(onPlay, []);
	const onLeaveCallback = useCallback(onLeave, []);
	if (!leagues) {
		return <Spinner />;
	}
	return (
		<Grid verticalAlign={'middle'} centered>
			{leagues.map(league => (
				<SwLeagueContainer key={league.name} mobile={16} tablet={6} computer={4}>
					<SwLeague league={league} onPlay={onPlayCallback} onLeave={onLeaveCallback} />
				</SwLeagueContainer>
			))}
		</Grid>
	);

	function onLeave(leagueDto: SelectableLeagueDto) {
		const app = container.get(SwApp);
		app.showConfirm({
			content: `Do you want to quit league ${leagueDto.title}?`,
			onConfirm: close => {
				leaveUserLeague({ leagueId: leagueDto.id, userId: user.id });
				close();
			},
		});
	}

	async function onPlay(leagueDto: SelectableLeagueDto) {
		const app = container.get(SwApp);
		if (leagueDto.selected) {
			await redirect({
				refresh: false,
				route: 'play-league',
				params: {
					id: leagueDto.id,
				},
			});
		} else {
			app.showModal({
				popupState: { userId: user.id, league: leagueDto },
				modalName: SHOW_LEAGUE_PREFERENCE,
			});
		}
	}
};
const leagueSelector = userLeagueSelector();
const enhancer = compose(
	registerEpic(fetchUserLeagueEpic, leaveUserLeagueEpic),
	registerReducer({ userLeagues: userLeagueReducer }),
	connect(
		state => ({
			leagues: leagueSelector(state)(state.auth.user && state.auth.user.id),
		}),
		{
			fetchUserLeagues,
			fetchLeagues,
			leaveUserLeague,
		}
	),
	memo
);

export const SwUserLeagues = enhancer(SwUserLeaguesComponent);
