import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { User } from '@schema/user/models/user.entity';
import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { IFindOptions } from 'sequelize-typescript';

@Injectable()
export class UserService {
	constructor(@Inject('USER_REPOSITORY') private readonly userRepository: typeof User) {}

	public async create(user: CreateUserDto): Promise<User> {
		return this.userRepository.create(user);
	}

	public async findAll(): Promise<User[]> {
		return await this.userRepository.findAll();
	}

	public async findOne(params: IFindOptions<User>): Promise<User | null> {
		return await this.userRepository.findOne(params);
	}

	public async update(id: number, createUserDto: CreateUserDto): Promise<UserDto> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundException(`User with id ${id} cannot be found`);
		}

		const { firstName, lastName, password } = createUserDto;

		user.firstName = firstName;
		user.lastName = lastName;
		user.password = password;

		return user.save();
	}

	public async delete(params: IFindOptions<User>): Promise<any> {
		const user = await this.userRepository.findOne(params);
		if (!user) {
			return;
		}
		return user.destroy();
	}
}
