import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'typeorm';
import { Logger as SchemaLogger } from 'log4js';
import { SCHEMA_LOGGER } from '@core/logging/logging.constant';

@Injectable()
export class TypeormLoggerService implements Logger {
	constructor(@Inject(SCHEMA_LOGGER) private logger: SchemaLogger) {}

	public logQuery(query: string, parameters?: any[]) {
		this.logger.trace(query, parameters);
	}

	public logQueryError(error: string, query: string, parameters?: any[]) {
		this.logger.error(error, query, parameters);
	}

	public logQuerySlow(time: number, query: string, parameters?: any[]) {
		this.logger.warn(`Slow query took ${time} ms: %o %o %o`, query, parameters);
	}

	public logSchemaBuild(message: string) {
		this.logger.info(message);
	}

	public logMigration(message: string) {
		this.logger.info(message);
	}

	public error(message: string, ...args) {
		this.logger.error(message, ...args);
	}

	public log(level: 'log' | 'info' | 'warn', message: any) {
		switch (level) {
			case 'log':
				this.logger.info(message);
				break;
			case 'info':
				this.logger.info(message);
				break;
			case 'warn':
				this.logger.warn(message);
				break;
		}
	}
}
