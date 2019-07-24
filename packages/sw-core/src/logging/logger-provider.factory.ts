import { Inject, Injectable } from '@nestjs/common';
import { Provider } from 'nconf';
import log4j, { Configuration } from 'log4js';
import merge from 'lodash.merge';
import os from 'os';
import { CORE_CONFIG } from '@core/config/config.constants';

function filenameToken(logEvent) {
	return logEvent.fileName ? logEvent.fileName.replace(__dirname, '').replace(/^\/webpack:/, '') : '';
}

const colorPatternLayout = {
	type: 'pattern',
	pattern: '%[ %d %p %c %] %h (%x{file}:%l) %m%n',
	tokens: {
		file: filenameToken,
	},
};
const defaultPatternLayout = {
	type: 'pattern',
	pattern: '%d %p %c  %h (%x{file}:%l) %m%n',
	tokens: {
		file: filenameToken,
	},
};

@Injectable()
export class LoggerProviderFactory {
	constructor(@Inject(CORE_CONFIG) private readonly coreConfig: Provider) {}

	configure() {
		const log4jConfig = this.buildConfig(this.coreConfig);
		return log4j.configure(log4jConfig);
	}

	private buildConfig(coreConfig): Configuration {
		let log4jsConfig: Configuration = {
			appenders: {},
			categories: {
				default: {
					appenders: [],
					level: log4j.levels.INFO.levelStr,
					// @ts-ignore
					enableCallStack: true,
				},
				http: {
					appenders: [],
					level: log4j.levels.INFO.levelStr,
					// @ts-ignore
					enableCallStack: true,
				},
			},
		};

		if (this.isFileLoggingEnabled(coreConfig)) {
			log4jsConfig = this.buildFileLoggingConfig(coreConfig, log4jsConfig);
		}

		if (this.isLogstashEnabled(coreConfig)) {
			log4jsConfig = this.buildLogStashConfig(log4jsConfig, coreConfig);
		}

		if (process.env.NODE_ENV !== 'production') {
			log4jsConfig = this.buildConsoleConfig(log4jsConfig);
		}

		return log4jsConfig;
	}

	private buildConsoleConfig(log4jsConfig: Configuration) {
		log4jsConfig = merge(log4jsConfig, {
			appenders: {
				console: {
					type: 'console',
					layout: colorPatternLayout,
				},
			},
			categories: {
				default: {
					appenders: ['console'],
					level: log4j.levels.DEBUG.levelStr,
				},
			},
		});
		return log4jsConfig;
	}

	private buildLogStashConfig(log4jsConfig: Configuration, coreConfig) {
		log4jsConfig = merge(log4jsConfig, {
			appenders: {
				logstash: {
					type: 'log4js-logstash-tcp',
					category: 'default',
					host: coreConfig.get('logging:logstash:host'),
					port: coreConfig.get('logging:logstash:port'),
					fields: {
						source: 'sportywide',
						environment: os.hostname(),
						group: process.env.NODE_ENV,
					},
					layout: defaultPatternLayout,
				},
			},
			categories: {
				default: {
					appenders: ['logstash'],
				},
				http: {
					appenders: ['logstash'],
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

		log4jsConfig = merge(log4jsConfig, {
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

	private isLogstashEnabled(config) {
		return !!config.get('logging:logstash');
	}
}
