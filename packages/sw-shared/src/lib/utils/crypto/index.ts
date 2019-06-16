import { pbkdf2Sync, randomBytes } from 'crypto';
const ITERATIONS = 2048;
const KEY_LENGTH = 32;
const DIGEST = 'sha512';

export function computeHash(password, salt) {
	return pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
}

export function hashPassword(password) {
	const salt = randomBytes(32).toString('hex');
	const hash = computeHash(password, salt);
	return [salt, hash].join('$');
}

export function comparePassword(rawPassword, passwordHash) {
	const [originalHash, salt] = passwordHash.split('$')[1];
	const computedHash = computeHash(rawPassword, salt);
	return originalHash === computedHash;
}
