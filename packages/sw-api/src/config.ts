import { readConfig } from '@shared/lib/config/config-reader';
import path from 'path';

export default readConfig(path.resolve(__dirname, 'sw-api', 'config'), process.env.NODE_ENV);
