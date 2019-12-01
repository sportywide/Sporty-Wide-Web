import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { SwLineupBuilder } from '@web/features/lineup/components/pitch/LineupBuilder';
import { DndProvider } from 'react-dnd-cjs';
import html5Backend from 'react-dnd-html5-backend-cjs';
import { SwDragLayer } from '@web/shared/lib/ui/components/dnd/DragLayer';
import { LeagueService } from '@web/features/leagues/base/services/league.service';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';

interface IProps {
	leagueId: number;
	league: LeagueDto;
}
class SwLineupBuilderPage extends React.Component<IProps> {
	static async getInitialProps({ query, store }) {
		const container = store.container;
		const leagueService = container.get(LeagueService);
		if (isNaN(query.id)) {
			return {};
		}
		const leagueId = parseInt(query.id, 10);
		const league = await leagueService.fetchLeague(leagueId).toPromise();
		return {
			leagueId,
			league,
		};
	}

	render() {
		return (
			<>
				<Head>
					<title>Build your lineup</title>
				</Head>
				<DndProvider backend={html5Backend}>
					<SwDragLayer />
					<SwGreyBackground padding>
						<SwContainer>
							<SwLineupBuilder leagueId={this.props.leagueId} />
						</SwContainer>
					</SwGreyBackground>
				</DndProvider>
			</>
		);
	}
}

export default SwLineupBuilderPage;
