import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLeaguePreferenceDocument } from '@schema/league/models/user-league-preference.schema';

@Injectable()
export class UserLeaguePreferenceService {
	constructor(
		@InjectModel('UserLeaguePreference') private readonly userPreferenceModel: Model<UserLeaguePreferenceDocument>
	) {}

	async save(userPreferenceDto): Promise<UserLeaguePreferenceDocument> {
		return this.userPreferenceModel.findOneAndUpdate(
			{
				userId: userPreferenceDto.userId,
				leagueId: userPreferenceDto.leagueId,
			},
			userPreferenceDto,
			{
				upsert: true,
				new: true,
			}
		);
	}

	async find({ userId, leagueId }): Promise<UserLeaguePreferenceDocument | null> {
		return await this.userPreferenceModel
			.findOne({
				userId,
				leagueId,
			})
			.exec();
	}
}
