import { readConfig } from '@shared/lib/config/config-reader';
import path from 'path';

export default readConfig(path.resolve(__dirname, 'sw-core', 'config'), process.env.NODE_ENV);
