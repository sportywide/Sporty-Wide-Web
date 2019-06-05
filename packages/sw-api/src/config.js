const path = require('path');
const { readConfig } = require('@shared/lib/config/config-reader');
module.exports = readConfig(path.resolve(__dirname, 'sw-api', 'config'), process.env.NODE_ENV);
