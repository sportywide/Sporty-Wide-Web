/* global __non_webpack_require__ */

export function customRequire(path) {
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/camelcase
	return typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__(path) : null;
}
