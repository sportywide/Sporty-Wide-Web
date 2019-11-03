import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import SwInfra = require('../lib/sw-infra-stack');

test('Empty Stack', () => {
	const app = new cdk.App();
	// WHEN
	const stack = new SwInfra.SwInfraStack(app, 'MyTestStack');
	// THEN
	expectCDK(stack).to(
		matchTemplate(
			{
				Resources: {},
			},
			MatchStyle.EXACT
		)
	);
});
