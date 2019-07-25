import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { API_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { QueryFailedError } from 'typeorm';
import { getFriendlyErrorMessage } from '@schema/core/utils/error-message';
import { ForbiddenError } from 'csurf';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	constructor(@Inject(API_LOGGER) private apiLogger: Logger) {}
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

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

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message,
		});
	}
}
