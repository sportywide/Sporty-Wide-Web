import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { User } from '@schema/user/models/user.entity';
import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { BaseEntityService } from '@api/core/services/base-entity.service';
import { Repository, FindConditions } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService extends BaseEntityService<User> {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
		super(userRepository);
	}

	public async update(params: FindConditions<User>, createUserDto: CreateUserDto): Promise<UserDto> {
		const user = await this.userRepository.findOne(params);
		if (!user) {
			throw new NotFoundException(`User cannot be found`);
		}

		const { firstName, lastName, password } = createUserDto;

		user.firstName = firstName;
		user.lastName = lastName;
		user.password = password;

		const updatedUser = await this.userRepository.save(user);

		return plainToClass(UserDto, updatedUser);
	}
}
