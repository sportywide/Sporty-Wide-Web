import React from 'react';
import Head from 'next/head';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { Header } from 'semantic-ui-react';
import { SwTeamList } from '@web/features/team/TeamList';

class SwTeamListPage extends React.Component<any, any> {
	private leagueOptions: { text: string; value: number }[];

	render() {
		return (
			<>
				<Head>
					<title>Team List</title>
				</Head>
				<SwGreyBackground padding={true}>
					<SwContainer>
						<Header as={'h3'}>Team List</Header>
						<SwTeamList />
					</SwContainer>
				</SwGreyBackground>
			</>
		);
	}
}

export default SwTeamListPage;
