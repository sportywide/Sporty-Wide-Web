import path from 'path';
import { readConfig } from '@shared/lib/config/config-reader';

export default readConfig(path.resolve(__dirname, '..', 'config'), process.env.NODE_ENV);
