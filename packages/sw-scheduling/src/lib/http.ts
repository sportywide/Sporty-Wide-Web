import { HttpException, HttpStatus } from '@nestjs/common';

export function error(e: any = {}) {
	function failWithError({ status = HttpStatus.INTERNAL_SERVER_ERROR, message }) {
		return response({ error: message }, { statusCode: status });
	}

	if (typeof e === 'string') {
		return failWithError({ status: HttpStatus.INTERNAL_SERVER_ERROR, message: e });
	}

	if (e instanceof HttpException) {
		return failWithError({ message: e.message, status: e.status });
	}

	return failWithError({ status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal server error' });
}

export function ok(body, { contentType }: { contentType?: string } = {}) {
	return response(body, { contentType, statusCode: HttpStatus.OK });
}

export function response(body, { statusCode, contentType }: { statusCode: number; contentType?: string }) {
	if (!contentType) {
		contentType = typeof body === 'object' ? 'application/json' : 'text/plain';
	}
	return {
		contentType,
		statusCode,
		body: body && contentType === 'application/json' ? JSON.stringify(body) : body,
	};
}
