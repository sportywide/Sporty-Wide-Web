export class BusinessException extends Error {
	code: string;
	constructor(message, code) {
		super(message);
		this.code = code;
	}
}
