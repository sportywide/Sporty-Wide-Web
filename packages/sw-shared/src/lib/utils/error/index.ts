class ExtendError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor);
		} else {
			this.stack = new Error(message).stack;
		}
	}
}

export class RethrowError extends ExtendError {
	private original: Error;
	constructor(message, error) {
		super(message);
		if (!error) throw new Error('RethrownError requires a message and error');
		this.original = error;
		const messageLines = (this.message.match(/\n/g) || []).length + 1;
		if (error.request && error.config) {
			this.message = `${this.message} ${error.config.method.toUpperCase()} ${error.config.url}`;
		}
		this.stack =
			this.stack
				.split('\n')
				.slice(0, messageLines + 1)
				.join('\n') +
			'\n' +
			error.stack;
	}
}
