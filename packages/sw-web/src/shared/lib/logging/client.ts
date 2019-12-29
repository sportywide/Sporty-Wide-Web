/* eslint-disable no-console */

export const logger = {
	warn: console.warn.bind(console),
	error: console.error.bind(console),
	info: console.info.bind(console),
	debug: console.debug.bind(console),
	log: console.log.bind(console),
};
