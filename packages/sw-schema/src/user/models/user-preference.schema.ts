import mongoose, { Document } from 'mongoose';

export const UserPreferenceSchema = new mongoose.Schema({
	userId: Number,
	formation: String,
});

export interface UserPreference extends Document {
	userId: number;
	formation: string;
}
UserPreferenceSchema.index({ userID: 1 });