import { pbkdf2, pbkdf2Sync, randomBytes } from 'crypto';
import { promisify } from 'util';

const pbkdf2Promise = promisify(pbkdf2);
const ITERATIONS = 2048;
const KEY_LENGTH = 32;
const DIGEST = 'sha512';

export function computeHashSync(password, salt) {
	return pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
}

export function computeHash(password, salt) {
	return pbkdf2Promise(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).then(buffer => buffer.toString('hex'));
}

export function hashPasswordSync(password) {
	const salt = randomBytes(KEY_LENGTH).toString('hex');
	const hash = computeHashSync(password, salt);
	return [hash, salt].join('$');
}

export async function hashPassword(password) {
	const salt = randomBytes(KEY_LENGTH).toString('hex');
	const hash = await computeHash(password, salt);
	return [hash, salt].join('$');
}

export function comparePasswordSync(rawPassword, passwordHash) {
	const [originalHash, salt] = passwordHash.split('$');
	const computedHash = computeHashSync(rawPassword, salt);
	return originalHash === computedHash;
}

export async function comparePassword(rawPassword, passwordHash) {
	const [originalHash, salt] = passwordHash.split('$');
	const computedHash = await computeHash(rawPassword, salt);
	return originalHash === computedHash;
}
