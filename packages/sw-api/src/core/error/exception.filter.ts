import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { API_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { QueryFailedError } from 'typeorm';
import { getFriendlyErrorMessage } from '@schema/core/utils/error-message';
import { getRequest, getResponse, isGraphql } from '@api/utils/context';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	constructor(@Inject(API_LOGGER) private apiLogger: Logger) {}

	catch(exception: unknown, host: ArgumentsHost) {
		const request = getRequest(host);
		const response = getResponse(host);
		let message = exception instanceof Error ? exception.message : exception;

		let status = (exception as any).status || HttpStatus.INTERNAL_SERVER_ERROR;
		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const response = exception.getResponse();
			message = typeof response === 'object' && (response as any).message ? (response as any).message : response;
		} else if (exception instanceof QueryFailedError) {
			status = HttpStatus.BAD_REQUEST;
			message = getFriendlyErrorMessage(exception);
		}

		if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
			this.apiLogger.error(message, exception);
		}

		if (isGraphql(host)) {
			//apollo server handles error themselves
			throw new HttpException(
				{
					statusCode: status,
					timestamp: new Date().toISOString(),
					path: request.url,
					message,
				},
				status
			);
		} else {
			response.status(status).json({
				statusCode: status,
				timestamp: new Date().toISOString(),
				path: request.url,
				message,
			});
		}
	}
}
