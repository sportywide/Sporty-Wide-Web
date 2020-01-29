import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { SwLiveScore } from '@web/features/fixtures/components/LiveScores';
import { Header } from 'semantic-ui-react';

class SwLiveScorePage extends React.Component<any> {
	render() {
		return (
			<SwGreyBackground padding={true}>
				<Head>
					<title>Live scores</title>
				</Head>
				<SwContainer>
					<Header as={'h3'} className={'sw-mb2'}>
						Live Scores
					</Header>
					<SwLiveScore />
				</SwContainer>
			</SwGreyBackground>
		);
	}
}

export default SwLiveScorePage;
