import React from 'react';
import Head from 'next/head';
import { SwTransparentBackground } from '@web/shared/styled/core.styled';
import { Container } from 'semantic-ui-react';
import { loadPlayers } from '@web/features/players/store/actions';
import { SwLineupBuilder } from '@web/features/lineup/components/pitch/LineupBuilder';
import { DndProvider } from 'react-dnd-cjs';
import html5Backend from 'react-dnd-html5-backend-cjs';

interface IProps {
	loadPlayers: typeof loadPlayers;
}
class SwLineupBuilderPage extends React.Component<IProps> {
	render() {
		return (
			<>
				<Head>
					<title>Build your lineup</title>
				</Head>
				<SwTransparentBackground>
					<Container style={{ width: '100%' }} className="ub-py4">
						<DndProvider backend={html5Backend}>
							<SwLineupBuilder />
						</DndProvider>
					</Container>
				</SwTransparentBackground>
			</>
		);
	}
}

export default SwLineupBuilderPage;
