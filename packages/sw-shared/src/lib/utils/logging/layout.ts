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

export const networkLogOptions = {
	level: 'auto',
	nolog: '\\.js|\\.css|\\.png',
	statusRules: [
		{ from: 200, to: 399, level: 'debug' },
		{ from: 400, to: 499, level: 'info' },
		{ from: 500, to: 599, level: 'error' },
	],
	context: true,
	format: (req, res, format) =>
		format(`${getIP(req)} - ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent"`),
};

export function getIP(req) {
	return (
		req.headers['cf-connecting-ip'] ||
		req.headers['x-forwarded-for'] ||
		req.ip ||
		req._remoteAddress ||
		(req.socket && (req.socket.remoteAddress || (req.socket.socket && req.socket.socket.remoteAddress)))
	);
}
