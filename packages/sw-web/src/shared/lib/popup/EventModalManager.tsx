import React, { useContext, useEffect } from 'react';
import { render } from 'react-dom';
import { ContainerInstance } from 'typedi';
import { Provider, ReactReduxContext } from 'react-redux';
import { ContainerContext } from '@web/shared/lib/store';
import { EventDispatcher } from '@web/shared/lib/events/event-dispatcher';
import { SHOW_LEAGUE_PREFERENCE } from '@web/shared/lib/popup/modal.constants';
import { LeaguePreferenceModal } from '@web/features/leagues/user/components/LeaguePreferenceModal';
import ModalWrapper from './ModalWrapper';
import { SHOW_MODAL } from './event.constants';

const modalMapping = {
	[SHOW_LEAGUE_PREFERENCE]: LeaguePreferenceModal,
};

const EventModalManager: React.FC = function() {
	const container: ContainerInstance = useContext(ContainerContext);
	const { store } = useContext(ReactReduxContext);

	useEffect(() => {
		const eventDispatcher = container.get(EventDispatcher);
		return eventDispatcher.on(SHOW_MODAL, (event, { popupState, modalName }) => {
			if (!modalMapping[modalName]) {
				return;
			}
			const component = modalMapping[modalName];
			const element = document.createElement('div');
			const mountPoint = document.querySelector('#modal-container');
			mountPoint!!.appendChild(element);

			render(
				<Provider store={store}>
					<ModalWrapper
						popupState={popupState}
						onClose={() => mountPoint!!.removeChild(element)}
						component={component}
					/>
				</Provider>,
				element
			);
		});
	}, [container, store]);

	return <div id="modal-container" />;
};

export default EventModalManager;
