function filenameToken(logEvent) {
	return logEvent.fileName ? logEvent.fileName.replace(__dirname, '').replace(/^\/webpack:/, '') : '';
}

export const colorPatternLayout = {
	type: 'pattern',
	pattern: '%[ %d %p %c %] %h (%x{file}:%l) %m%n',
	tokens: {
		file: filenameToken,
	},
};
export const defaultPatternLayout = {
	type: 'pattern',
	pattern: '%d %p %c  %h (%x{file}:%l) %m%n',
	tokens: {
		file: filenameToken,
	},
};
