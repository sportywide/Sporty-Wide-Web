import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { Header, Select } from 'semantic-ui-react';
import { SwLeagueStandings } from '@web/features/leagues/base/components/LeagueStanding';
import { LeagueService } from '@web/features/leagues/base/services/league.service';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';

interface IProps {
	leagues: LeagueDto[];
}
interface IState {
	league: LeagueDto;
}
class SwStandingsPage extends React.Component<IProps, IState> {
	private leagueOptions: { text: string; value: number }[];

	static async getInitialProps({ store }) {
		const container = store.container;
		const leagueService = container.get(LeagueService);
		const [leagues] = await Promise.all([leagueService.fetchLeagues().toPromise()]);

		return {
			leagues,
		};
	}
	constructor(props: IProps) {
		super(props);
		this.leagueOptions = props.leagues.map(league => ({ text: league.title, value: league.id }));
		this.state = {
			league: props.leagues[0],
		};
	}
	render() {
		return (
			<>
				<Head>
					<title>Standings</title>
				</Head>
				<SwGreyBackground padding={true}>
					<SwContainer>
						<Header as={'h3'}>Standings</Header>
						<span>
							<Select
								className={'sw-mt2 sw-mb2'}
								options={this.leagueOptions}
								defaultValue={this.state.league.id}
								onChange={(e, { value }) => {
									const selectedLeague = this.props.leagues.find(league => league.id === value);
									this.setState({ league: selectedLeague });
								}}
							/>
						</span>
						<SwLeagueStandings league={this.state.league} />
					</SwContainer>
				</SwGreyBackground>
			</>
		);
	}
}

export default SwStandingsPage;
