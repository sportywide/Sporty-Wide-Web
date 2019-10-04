import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@schema/user/models/user.entity';
import { BaseEntityService } from '@api/core/services/entity/base-entity.service';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';
import { Token } from '@schema/auth/models/token.entity';
import { UserProfileService } from '@api/user/services/user-profile.service';
import { UserProfileDto } from '@shared/lib/dtos/user/profile/user-profile.dto';

@Injectable()
export class UserService extends BaseEntityService<User> {
	constructor(
		@InjectSwRepository(User) private readonly userRepository: SwRepository<User>,
		private readonly userProfileService: UserProfileService
	) {
		super(userRepository);
	}

	findBySocialId(socialId) {
		return this.findOne({ socialId });
	}

	async activateUser(user: number | User | undefined) {
		let userEntity;
		if (typeof user === 'number') {
			userEntity = await this.findById({ id: user, cache: true });
		} else {
			userEntity = user;
		}

		if (!userEntity) {
			throw new BadRequestException('Invalid user');
		}

		if (userEntity.status !== UserStatus.PENDING) {
			throw new BadRequestException('User is not pending');
		}

		userEntity.status = UserStatus.ACTIVE;
		return this.saveOne(userEntity);
	}

	async findByToken({ token: tokenValue }: { token: string }) {
		return this.userRepository
			.createQueryBuilder('user')
			.where(qb => {
				const subQuery = qb
					.subQuery()
					.select('token.engagementId')
					.from(Token, 'token')
					.where('token.engagementTable = :engagementTable')
					.andWhere('token.content = :content')
					.getQuery();
				return 'user.id IN ' + subQuery;
			})
			.setParameter('engagementTable', this.userRepository.getTableName())
			.setParameter('content', tokenValue)
			.getOne();
	}

	async createUserProfile(user: User, userProfileDto: UserProfileDto) {
		let userProfile = await this.userProfileService.createOneEntity(userProfileDto);
		userProfile = await this.userProfileService.saveOne(userProfile);
		user.profile = userProfile;
		await this.saveOne(user);
		return userProfile;
	}
}
