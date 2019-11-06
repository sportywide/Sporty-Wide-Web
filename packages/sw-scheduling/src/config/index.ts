import { createConfig } from '@shared/lib/config/config-reader';

export default createConfig(require('./config').config, process.env.NODE_ENV);
