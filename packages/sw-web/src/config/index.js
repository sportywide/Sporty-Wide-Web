const { readConfig } = require('sportywide-shared/src/lib/config/config-reader');
module.exports = readConfig(__dirname, process.env.NODE_ENV);
