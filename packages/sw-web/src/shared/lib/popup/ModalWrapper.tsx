import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';
import { noop } from '@shared/lib/utils/functions';

interface IProps {
	component: any;
	popupState: any;
	closeOnDimmerClick?: boolean;
	onClose?: Function;
	dimmer?: true | 'inverted' | 'blurring';
}
const ModalWrapper: React.FC<IProps> = function({
	component: ModalComponent,
	closeOnDimmerClick = true,
	onClose = noop,
	dimmer = 'inverted',
	popupState = {},
}) {
	const [open, setOpen] = useState(true);

	return (
		<Modal open={open} closeOnDimmerClick={closeOnDimmerClick} onClose={closePopup} dimmer={dimmer}>
			<ModalComponent popupState={popupState} onClose={closePopup} />
		</Modal>
	);

	function closePopup() {
		setOpen(false);
		onClose();
	}
};

export default ModalWrapper;
