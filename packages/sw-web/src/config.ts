import path from 'path';
import { readConfig } from '@shared/lib/config/config-reader';

export default readConfig(path.resolve(__dirname, 'sw-web', 'config'), process.env.NODE_ENV);
