import { Injectable } from '@nestjs/common';
import { User } from '@schema/user/models/user.entity';
import { BaseEntityService } from '@api/core/services/entity/base-entity.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService extends BaseEntityService<User> {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
		super(userRepository);
	}
}
