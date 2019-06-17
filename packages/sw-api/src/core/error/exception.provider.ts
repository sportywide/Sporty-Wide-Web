import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '@api/core/error/exception.filter';

export const exceptionFilterProvider = {
	provide: APP_FILTER,
	useClass: GlobalExceptionFilter,
};
