import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { SwLineupBuilder } from '@web/features/lineup/components/pitch/LineupBuilder';
import { DndProvider } from 'react-dnd-cjs';
import html5Backend from 'react-dnd-html5-backend-cjs';
import { SwDragLayer } from '@web/shared/lib/ui/components/dnd/DragLayer';

class SwLineupBuilderPage extends React.Component<any> {
	render() {
		return (
			<>
				<Head>
					<title>Build your lineup</title>
				</Head>
				<DndProvider backend={html5Backend}>
					<SwDragLayer />
					<SwGreyBackground style={{ paddingTop: 'var(--space-1)' }}>
						<SwContainer>
							<SwLineupBuilder />
						</SwContainer>
					</SwGreyBackground>
				</DndProvider>
			</>
		);
	}
}

export default SwLineupBuilderPage;
