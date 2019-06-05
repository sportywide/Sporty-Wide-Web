const path = require('path');
const { readConfig } = require('sportywide-shared/src/lib/config/config-reader');
module.exports = readConfig(path.resolve(__dirname, '..', 'config'), process.env.NODE_ENV);
