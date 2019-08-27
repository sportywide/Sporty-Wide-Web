import crypto from 'crypto';
import { promisifyAll } from '@shared/lib/utils/promisify/promisify';
import { PromisifyAll } from '@shared/lib/utils/promisify/index.d.ts';

export const cryptoPromise: PromisifyAll<typeof crypto> = promisifyAll(crypto);
