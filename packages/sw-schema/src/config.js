const path = require('path');
const { readConfig } = require('@shared/lib/config/config-reader');
module.exports = readConfig(path.resolve(__dirname, 'sw-schema', 'config'), process.env.NODE_ENV);
