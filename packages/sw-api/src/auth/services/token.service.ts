import { Injectable } from '@nestjs/common';
import { BaseEntityService } from '@api/core/services/entity/base-entity.service';
import { Token } from '@schema/auth/models/token.entity';
import uuid from 'uuid';
import { addDays } from 'date-fns';
import { User } from '@schema/user/models/user.entity';
import { TokenType } from '@schema/auth/models/enums/token-type.token';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';

const VERIFY_EMAIL_TOKEN_EXPIRATION_LENGTH = 2;
const FORGOT_PASSWORD_TOKEN_EXPIRATION_LENGTH = 1;

@Injectable()
export class TokenService extends BaseEntityService<Token> {
	constructor(@InjectSwRepository(Token) private readonly tokenRepository: SwRepository<Token>) {
		super(tokenRepository);
	}
	createVerifyEmailToken(user: User) {
		const token: Partial<Token> = {
			content: uuid(),
			engagementId: user.id,
			engagementTable: this.tokenRepository.getTableNameForEntity(User),
			type: TokenType.CONFIRM_EMAIL,
			ttl: addDays(new Date(), VERIFY_EMAIL_TOKEN_EXPIRATION_LENGTH),
		};
		return this.saveOne(token as Token);
	}

	async createForgotPasswordToken(user: User) {
		const token: Partial<Token> = {
			content: uuid(),
			engagementId: user.id,
			engagementTable: this.tokenRepository.getTableNameForEntity(User),
			type: TokenType.FORGOT_PASSWORD,
			ttl: addDays(new Date(), FORGOT_PASSWORD_TOKEN_EXPIRATION_LENGTH),
		};
		return this.saveOne(token as Token);
	}
}
