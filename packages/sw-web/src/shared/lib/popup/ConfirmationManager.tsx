import React, { useContext, useEffect, useState } from 'react';
import { Confirm } from 'semantic-ui-react';
import { ContainerContext } from '@web/shared/lib/store';
import { EventDispatcher } from '@web/shared/lib/events/event-dispatcher';
import { SHOW_CONFIRM } from './event.constants';

let confirmIndex = 0;

const ConfirmationManager: React.FC = function() {
	const [confirms, setConfirms] = useState([] as any[]);
	const container = useContext(ContainerContext);

	useEffect(() => {
		const eventDispatcher = container.get(EventDispatcher);
		return eventDispatcher.on(SHOW_CONFIRM, (event, { onCancel, onConfirm, content }) => {
			setConfirms(
				confirms.concat({
					id: confirmIndex++,
					onCancel:
						onCancel ||
						function(close) {
							close();
						},
					onConfirm:
						onConfirm ||
						function(close) {
							close();
						},
					content,
				})
			);
		});
	}, [confirms, container]);

	return (
		<>
			{confirms.map(confirm => {
				const close = () => {
					setConfirms(confirms.filter(otherConfirm => otherConfirm.id !== confirm.id));
				};
				return (
					<Confirm
						open={true}
						key={confirm.id}
						dimmer="inverted"
						content={confirm.content}
						onCancel={() => confirm.onCancel(close)}
						onConfirm={() => confirm.onConfirm(close)}
					/>
				);
			})}
		</>
	);
};

export default ConfirmationManager;
