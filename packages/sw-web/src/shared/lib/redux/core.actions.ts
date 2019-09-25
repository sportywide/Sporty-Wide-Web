export const EPIC_ERROR = Symbol('EPIC_ERROR');

export function epicError(e) {
	return {
		type: EPIC_ERROR,
		payload: e,
		error: true,
	};
}
