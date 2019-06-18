import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ValidationError } from 'sequelize';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private logger: Logger;
	constructor() {
		this.logger = new Logger(GlobalExceptionFilter.name);
	}
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
			this.logger.error(message, exception instanceof Error ? exception.stack : undefined);
		}

		response.status(status).json({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message,
		});
	}
}
