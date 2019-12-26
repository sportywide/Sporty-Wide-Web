import { Inject, Injectable } from '@nestjs/common';
import { Provider } from 'nconf';
import { mergeConcatArray } from '@shared/lib/utils/object/merge';
import log4j, { Configuration } from 'log4js';
import { CORE_CONFIG } from '@core/config/config.constants';
import { logzAppender } from '@shared/lib/utils/logging/logz';
import { colorPatternLayout, defaultPatternLayout } from '@shared/lib/utils/logging/layout';

@Injectable()
export class LoggerProviderFactory {
	constructor(@Inject(CORE_CONFIG) private readonly coreConfig: Provider) {}

	configure(logLevel) {
		const log4jConfig = this.buildConfig(this.coreConfig, log4j.levels[logLevel].levelStr);
		const loggerFactory = log4j.configure(log4jConfig);
		const logger = loggerFactory.getLogger('core');
		logger.info('Log level', logLevel);
		return loggerFactory;
	}

	private buildConfig(coreConfig, defaultLevel = log4j.levels.INFO.levelStr): Configuration {
		let log4jsConfig: Configuration = {
			appenders: {},
			categories: {
				default: {
					appenders: [],
					level: defaultLevel,
					// @ts-ignore
					enableCallStack: true,
				},
				http: {
					appenders: [],
					level: defaultLevel,
					// @ts-ignore
					enableCallStack: true,
				},
			},
		};

		if (this.isFileLoggingEnabled(coreConfig)) {
			log4jsConfig = this.buildFileLoggingConfig(coreConfig, log4jsConfig);
		}

		if (this.isLogzEnabled(coreConfig)) {
			log4jsConfig = this.buildLogzConfig(log4jsConfig, coreConfig);
		}

		log4jsConfig = this.buildConsoleConfig(log4jsConfig);

		for (const category of Object.keys(log4jsConfig.categories)) {
			if (!log4jsConfig.categories[category].appenders.length) {
				delete log4jsConfig.categories[category];
			}
		}

		return log4jsConfig;
	}

	private buildConsoleConfig(log4jsConfig: Configuration) {
		log4jsConfig = mergeConcatArray(log4jsConfig, {
			appenders: {
				console: {
					type: 'console',
					layout: colorPatternLayout,
				},
			},
			categories: {
				default: {
					appenders: ['console'],
				},
				http: {
					appenders: [],
				},
			},
		});
		return log4jsConfig;
	}

	private buildLogzConfig(log4jsConfig: Configuration, coreConfig) {
		log4jsConfig = mergeConcatArray(log4jsConfig, {
			appenders: {
				logz: {
					type: logzAppender(coreConfig.get('logging:logz:token')),
					layout: defaultPatternLayout,
				},
			},
			categories: {
				default: {
					appenders: ['logz'],
				},
				http: {
					appenders: ['logz'],
				},
			},
		});
		return log4jsConfig;
	}

	private buildFileLoggingConfig(coreConfig, log4jsConfig: Configuration) {
		const {
			log_path: logPath,
			log_file: logFile,
			max_log_size: maxLogSize,
			num_backups: numBackups,
		} = coreConfig.get('logging:file');

		log4jsConfig = mergeConcatArray(log4jsConfig, {
			appenders: {
				access: {
					type: 'dateFile',
					filename: `${logPath}/access.log`,
					pattern: '-yyyy-MM-dd',
					category: 'http',
					layout: defaultPatternLayout,
				},
				app: {
					type: 'file',
					filename: `${logPath}/${logFile}`,
					maxLogSize,
					numBackups,
					layout: defaultPatternLayout,
				},
				errorFile: {
					type: 'file',
					filename: `${logPath}/error.log`,
					layout: defaultPatternLayout,
				},
				errors: {
					type: 'logLevelFilter',
					level: log4j.levels.ERROR.levelStr,
					appender: 'errorFile',
					layout: defaultPatternLayout,
				},
			},
			categories: {
				default: {
					appenders: ['app', 'errors'],
				},
				http: {
					appenders: ['access'],
				},
			},
		});
		return log4jsConfig;
	}

	private isFileLoggingEnabled(config) {
		return !!config.get('logging:file');
	}

	private isLogzEnabled(config) {
		return !!config.get('logging:logz');
	}
}
