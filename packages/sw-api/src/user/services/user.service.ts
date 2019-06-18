import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { User } from '@schema/user/models/user.entity';
import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { IFindOptions } from 'sequelize-typescript';
import { BaseEntityService } from '@api/core/services/base-entity.service';

@Injectable()
export class UserService extends BaseEntityService<User> {
	constructor(@Inject('USER_REPOSITORY') private readonly userRepository: typeof User) {
		super(userRepository);
	}

	public async update(params: IFindOptions<User>, createUserDto: CreateUserDto): Promise<UserDto> {
		const user = await this.userRepository.findOne(params);
		if (!user) {
			throw new NotFoundException(`User cannot be found`);
		}

		const { firstName, lastName, password } = createUserDto;

		user.set('firstName', firstName);
		user.set('lastName', lastName);
		user.set('password', password);

		return user.save();
	}
}
