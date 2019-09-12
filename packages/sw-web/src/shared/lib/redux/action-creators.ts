import { createStandardAction } from 'typesafe-actions';

export function createSwStandardAction(actionType: string | symbol) {
	return createStandardAction(actionType as string);
}
