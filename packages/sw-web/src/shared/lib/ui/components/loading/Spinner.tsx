import ReactDOM from 'react-dom';
import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export function Spinner({ portalRoot = '#loading-portal' }) {
	const modalRoot = typeof window !== 'undefined' ? document.querySelector(portalRoot) : null;
	if (!modalRoot) {
		return null;
	}
	return ReactDOM.createPortal(
		<Dimmer active inverted>
			<Loader active />
		</Dimmer>,
		modalRoot
	);
}
