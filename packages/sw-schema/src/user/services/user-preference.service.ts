import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPreference } from '@schema/user/models/user-preference.schema';

@Injectable()
export class UserPreferenceService {
	constructor(@InjectModel('UserPreference') private readonly userPreferenceModel: Model<UserPreference>) {}

	async save(userPreferenceDto): Promise<UserPreference> {
		return this.userPreferenceModel.updateOne(
			{
				userId: userPreferenceDto.userId,
			},
			userPreferenceDto,
			{
				upsert: true,
			}
		);
	}

	async findById(userId): Promise<UserPreference | null> {
		return await this.userPreferenceModel
			.findOne({
				userId,
			})
			.exec();
	}
}
