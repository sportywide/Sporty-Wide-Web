import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@schema/user/models/user.entity';
import { BaseEntityService } from '@api/core/services/entity/base-entity.service';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { UserStatus } from '@shared/lib/dtos/user/enum/user-status.enum';

@Injectable()
export class UserService extends BaseEntityService<User> {
	constructor(@InjectSwRepository(User) private readonly userRepository: SwRepository<User>) {
		super(userRepository);
	}

	findBySocialId(socialId) {
		return this.findOne({ socialId });
	}

	async activateUser(user: number | User | undefined) {
		if (typeof user === 'number') {
			user = await this.findById(user, true);
		}

		if (!user) {
			throw new BadRequestException('Invalid user');
		}

		user.status = UserStatus.ACTIVE;
		return this.saveOne(user);
	}
}
