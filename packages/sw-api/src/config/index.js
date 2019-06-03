const { readConfig } = require('@shared/lib/config/config-reader');
module.exports = readConfig(__dirname, process.env.NODE_ENV);
