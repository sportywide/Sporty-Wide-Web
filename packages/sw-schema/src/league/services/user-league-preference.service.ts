import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLeaguePreference } from '@schema/league/models/user-league-preference.schema';

@Injectable()
export class UserLeaguePreferenceService {
	constructor(
		@InjectModel('UserLeaguePreference') private readonly userPreferenceModel: Model<UserLeaguePreference>
	) {}

	async save(userPreferenceDto): Promise<UserLeaguePreference> {
		return this.userPreferenceModel.updateOne(
			{
				userId: userPreferenceDto.userId,
				leagueId: userPreferenceDto.leagueId,
			},
			userPreferenceDto,
			{
				upsert: true,
			}
		);
	}

	async find({ userId, leagueId }): Promise<UserLeaguePreference | null> {
		return await this.userPreferenceModel
			.findOne({
				userId,
				leagueId,
			})
			.exec();
	}
}
