import { Injectable } from '@nestjs/common';
import { comparePassword, computeHash, hashPassword } from '@shared/lib/utils/crypto';

@Injectable()
export class CryptoService {
	public hashPassword(password) {
		return hashPassword(password);
	}

	public comparePassword(rawPassword, passwordHash) {
		return comparePassword(rawPassword, passwordHash);
	}

	private computeHash(password, salt) {
		return computeHash(password, salt);
	}
}
