import mongoose, { Document } from 'mongoose';

export const UserPlayersSchema = new mongoose.Schema({
	userId: Number,
	week: Date,
	formation: String,
	leagueId: Number,
	players: [Number],
});

UserPlayersSchema.index({
	userId: 1,
	week: 1,
	leagueId: 1,
});

export interface UserPlayersDocument extends Document {
	userId: number;
	week: Date;
	formation: string;
	leagueId: number;
	players: number[];
}
