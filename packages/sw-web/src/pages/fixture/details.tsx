import React from 'react';
import Head from 'next/head';
import { FixtureService } from '@web/features/fixtures/services/fixture.service';
import { SwGreyBackground } from '@web/shared/styled/Background.styled';

class SwFixtureDetailsPage extends React.Component<any> {
	static async getInitialProps({ query, store }) {
		const container = store.container;
		if (isNaN(query.id)) {
			return {};
		}
		const fixtureService = container.get(FixtureService);
		const fixtureId = parseInt(query.id, 10);
		const fixture = await fixtureService.fetchFixture(fixtureId).toPromise();
		return {
			fixtureId,
			fixture,
		};
	}
	render() {
		if (!this.props.fixture) {
			return null;
		}
		return (
			<SwGreyBackground padding={true}>
				<Head>
					<title>{this.props.fixture.id}</title>
				</Head>
			</SwGreyBackground>
		);
	}
}

export default SwFixtureDetailsPage;
