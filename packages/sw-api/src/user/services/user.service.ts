import { Injectable } from '@nestjs/common';
import { User } from '@schema/user/models/user.entity';
import { BaseEntityService } from '@api/core/services/entity/base-entity.service';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { SwRepository } from '@schema/core/repository/sql/base.repository';

@Injectable()
export class UserService extends BaseEntityService<User> {
	constructor(@InjectSwRepository(User) private readonly userRepository: SwRepository<User>) {
		super(userRepository);
	}

	findBySocialId(socialId) {
		return this.findOne({ socialId });
	}
}
