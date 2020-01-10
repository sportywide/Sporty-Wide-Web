import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export function Spinner() {
	return (
		<Dimmer active inverted>
			<Loader active />
		</Dimmer>
	);
}
