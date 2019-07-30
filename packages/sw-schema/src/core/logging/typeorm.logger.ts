import { Injectable, Inject } from '@nestjs/common';
import { Logger, QueryRunner } from 'typeorm';
import { Logger as SchemaLogger } from 'log4js';
import { SCHEMA_LOGGER } from '@core/logging/logging.constant';

@Injectable()
export class TypeormLoggerService implements Logger {
	constructor(@Inject(SCHEMA_LOGGER) private logger: SchemaLogger) {}

	public logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
		this.logger.trace(query, parameters, queryRunner);
	}

	public logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
		this.logger.error(query, parameters, queryRunner);
	}

	public logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
		this.logger.warn(`Slow query took ${time} ms: %o %o %o`, query, parameters, queryRunner);
	}

	public logSchemaBuild(message: string, queryRunner?: QueryRunner) {
		this.logger.info(message, queryRunner);
	}

	public logMigration(message: string, queryRunner?: QueryRunner) {
		this.logger.info(message, queryRunner);
	}

	public log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
		switch (level) {
			case 'log':
				this.logger.info(message, queryRunner);
				break;
			case 'info':
				this.logger.info(message, queryRunner);
				break;
			case 'warn':
				this.logger.warn(message, queryRunner);
				break;
		}
	}
}
