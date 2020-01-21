import { EventDispatcher } from '@web/shared/lib/events/event-dispatcher';
import { SHOW_CONFIRM, SHOW_MODAL, SIDEBAR_CLOSED, WINDOW_CLICK } from '@web/shared/lib/popup/event.constants';
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

	onWindowClick(eventHandler) {
		return this.eventDispatcher.on(WINDOW_CLICK, eventHandler);
	}

	onSideBarClosed(eventHandler) {
		return this.eventDispatcher.on(SIDEBAR_CLOSED, eventHandler);
	}

	showModal({ popupState, modalName }) {
		this.eventDispatcher.trigger(SHOW_MODAL, {
			popupState,
			modalName,
		});
	}
}
