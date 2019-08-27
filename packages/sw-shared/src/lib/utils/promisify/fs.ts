import fs from 'fs';
import { promisifyAll } from '@shared/lib/utils/promisify/promisify';
import { PromisifyAll } from '@shared/lib/utils/promisify/index.d.ts';

export const fsPromise: PromisifyAll<typeof fs> = promisifyAll(fs);
