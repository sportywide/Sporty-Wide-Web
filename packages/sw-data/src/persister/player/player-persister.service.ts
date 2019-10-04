import { Injectable } from '@nestjs/common';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { User } from '@schema/user/models/user.entity';
import { SwRepository } from '@schema/core/repository/sql/base.repository';

@Injectable()
export class PlayerPersisterService {
	constructor(@InjectSwRepository(User) private readonly userRepository: SwRepository<User>) {}

	findUsers() {
		return this.userRepository.find();
	}
}
