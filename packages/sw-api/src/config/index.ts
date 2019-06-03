const { readConfig } = require('@shared/lib/config/config-reader');
export const config = readConfig(__dirname, process.env.NODE_ENV);
