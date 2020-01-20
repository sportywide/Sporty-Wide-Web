import { EventDispatcher } from '@web/shared/lib/events/event-dispatcher';
import { SHOW_CONFIRM, SHOW_MODAL } from '@web/shared/lib/popup/event.constants';
import { Service } from 'typedi';

@Service()
export class SwApp {
	constructor(private readonly eventDispatcher: EventDispatcher) {}

	showConfirm({
		content,
		onConfirm,
		onCancel,
	}: {
		content: string;
		onConfirm?: (close?: Function) => void;
		onCancel?: (close?: Function) => void;
	}) {
		this.eventDispatcher.trigger(SHOW_CONFIRM, {
			content,
			onConfirm,
			onCancel,
		});
	}

	showModal({ popupState, modalName }) {
		this.eventDispatcher.trigger(SHOW_MODAL, {
			popupState,
			modalName,
		});
	}
}
