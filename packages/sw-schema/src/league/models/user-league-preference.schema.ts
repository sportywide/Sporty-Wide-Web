import mongoose, { Document } from 'mongoose';

export const UserLeaguePreferenceSchema = new mongoose.Schema({
	userId: Number,
	formation: String,
	leagueId: Number,
});

export interface UserLeaguePreference extends Document {
	userId: number;
	formation: string;
	leagueId: string;
}
UserLeaguePreferenceSchema.index({ userId: 1, leagueId: 1 });
