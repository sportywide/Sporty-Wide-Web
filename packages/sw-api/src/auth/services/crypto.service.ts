import { Injectable } from '@nestjs/common';
import { comparePassword, computeHash, hashPassword } from '@shared/lib/utils/crypto';

@Injectable()
export class CryptoService {
	public static hashPassword(password) {
		return hashPassword(password);
	}

	public static comparePassword(rawPassword, passwordHash) {
		return comparePassword(rawPassword, passwordHash);
	}

	private static computeHash(password, salt) {
		return computeHash(password, salt);
	}
}
