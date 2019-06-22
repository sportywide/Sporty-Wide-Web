import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ValidationError } from 'sequelize';
import { API_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	constructor(@Inject(API_LOGGER) private apiLogger: Logger) {}
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		if (exception instanceof HttpException) {
			status = exception.getStatus();
		} else if (exception instanceof ValidationError) {
			status = HttpStatus.BAD_REQUEST;
		}

		const message = exception instanceof Error ? exception.message : exception;

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
