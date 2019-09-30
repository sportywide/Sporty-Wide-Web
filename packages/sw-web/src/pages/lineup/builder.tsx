import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { SwLineupBuilder } from '@web/features/lineup/components/pitch/LineupBuilder';
import { DndProvider } from 'react-dnd-cjs';
import html5Backend from 'react-dnd-html5-backend-cjs';

class SwLineupBuilderPage extends React.Component<any> {
	render() {
		return (
			<>
				<Head>
					<title>Build your lineup</title>
				</Head>
				<SwGreyBackground style={{ paddingTop: 'var(--space-1)' }}>
					<SwContainer>
						<DndProvider backend={html5Backend}>
							<SwLineupBuilder />
						</DndProvider>
					</SwContainer>
				</SwGreyBackground>
			</>
		);
	}
}

export default SwLineupBuilderPage;
