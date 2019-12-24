import React from 'react';
import Head from 'next/head';
import { FixtureService } from '@web/features/fixtures/services/fixture.service';
import { SwContainer, SwGreyBackground } from '@web/shared/styled/Background.styled';
import { to404 } from '@web/shared/lib/navigation/helper';
import { SwFixtureDetails } from '@web/features/fixtures/components/FixtureDetails';

class SwFixtureDetailsPage extends React.Component<any> {
	static async getInitialProps({ query, store }) {
		const container = store.container;
		if (isNaN(query.id)) {
			return {};
		}
		const fixtureService = container.get(FixtureService);
		const fixtureId = parseInt(query.id, 10);
		const fixtureDetails = await fixtureService.fetchFixtureDetails(fixtureId).toPromise();
		if (!fixtureDetails) {
			await to404();
			return {};
		}
		return {
			fixtureId,
			fixtureDetails,
		};
	}
	render() {
		if (!this.props.fixtureDetails) {
			return null;
		}
		return (
			<SwGreyBackground padding={true}>
				<Head>
					<title>
						{this.props.fixtureDetails.fixture.home} - {this.props.fixtureDetails.fixture.away}
					</title>
				</Head>
				<SwContainer>
					<SwFixtureDetails fixtureDetails={this.props.fixtureDetails} />
				</SwContainer>
			</SwGreyBackground>
		);
	}
}

export default SwFixtureDetailsPage;
