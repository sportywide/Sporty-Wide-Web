import mongoose, { Document } from 'mongoose';
import { UserLeaguePreferenceDto } from '@shared/lib/dtos/leagues/user-league-preference.dto';
import { Diff, MongooseDocument } from '@shared/lib/utils/types';

export const UserLeaguePreferenceSchema = new mongoose.Schema({
	userId: Number,
	formation: String,
	leagueId: Number,
});

export interface UserLeaguePreferenceDocument extends Diff<UserLeaguePreferenceDto, MongooseDocument>, Document {}

UserLeaguePreferenceSchema.index({ userId: 1, leagueId: 1 });
