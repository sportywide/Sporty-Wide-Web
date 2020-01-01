import { Inject, Injectable } from '@nestjs/common';
import uuid from 'uuid';
import { User } from '@schema/user/models/user.entity';
import { RedisService } from '@core/redis/redis.service';
import { API_CONFIG } from '@core/config/config.constants';
import { Provider } from 'nconf';
import { JwtService } from '@nestjs/jwt';
import { forgotPasswordKey, refreshTokenKey, verifyEmailKey } from '@core/redis/redis.constants';

@Injectable()
export class TokenService {
	constructor(
		private readonly redisService: RedisService,
		@Inject(API_CONFIG) private readonly config: Provider,
		private readonly jwtService: JwtService
	) {}
	async createVerifyEmailToken(user: User) {
		const redisKey = verifyEmailKey(user.id);
		await this.redisService.client.set(
			redisKey,
			`${user.id}:${uuid()}`,
			'EX',
			this.config.get('auth:verify_email_expiration_time')
		);
	}

	getVerifyEmailToken(userId: number) {
		const redisKey = verifyEmailKey(userId);
		return this.redisService.client.get(redisKey);
	}

	getForgotPasswordToken(userId: number) {
		const redisKey = forgotPasswordKey(userId);
		return this.redisService.client.get(redisKey);
	}

	async createForgotPasswordToken(user: User) {
		const redisKey = forgotPasswordKey(user.id);
		await this.redisService.client.set(
			redisKey,
			`${user.id}:${uuid()}`,
			'EX',
			this.config.get('auth:forgot_password_expiration_time')
		);
	}

	async deleteForgotPasswordToken(userId) {
		const redisKey = forgotPasswordKey(userId);
		await this.redisService.client.del(redisKey);
	}

	async deleteVerifyEmailToken(userId) {
		const redisKey = verifyEmailKey(userId);
		await this.redisService.client.del(redisKey);
	}

	public createAccessToken(user: User): string {
		const id = user.id;
		return this.jwtService.sign({
			user: {
				id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				username: user.username,
				name: user.name,
				status: user.status,
				socialProvider: user.socialProvider,
			},
		});
	}

	public async createRefreshToken(user: User): Promise<string> {
		const refreshKey = refreshTokenKey(user.id);
		let refreshToken = await this.redisService.client.get(refreshKey);
		if (!refreshToken) {
			refreshToken = `${user.id}:${uuid()}`;
			await this.redisService.client.set(
				refreshKey,
				refreshToken,
				'EX',
				this.config.get('auth:refresh_token_expiration_time')
			);
		} else {
			await this.redisService.client.expire(refreshKey, this.config.get('auth:refresh_token_expiration_time'));
		}
		return refreshToken;
	}

	public async getRefreshToken(userId: number): Promise<string> {
		const refreshKey = refreshTokenKey(userId);
		return this.redisService.client.get(refreshKey);
	}
}
