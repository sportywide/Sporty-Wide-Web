let exportVars;
if (process.env.IS_SERVER) {
	exportVars = require('./server');
} else {
	exportVars = require('./client');
}

export const log4jsFactory = exportVars.log4jsFactory;
export const logger = exportVars.logger;
