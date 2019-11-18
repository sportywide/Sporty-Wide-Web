import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { SwUserLeagues } from '@web/features/leagues/user/components/UserLeague';
import { Header } from 'semantic-ui-react';

class SwUserLeaguePage extends React.Component<any> {
	render() {
		return (
			<>
				<Head>
					<title>User Leagues</title>
				</Head>
				<SwGreyBackground padding={true}>
					<SwContainer>
						<Header as={'h3'}>Your Leagues</Header>
						<SwUserLeagues />
					</SwContainer>
				</SwGreyBackground>
			</>
		);
	}
}

export default SwUserLeaguePage;
