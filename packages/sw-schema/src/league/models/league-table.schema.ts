import mongoose, { Document } from 'mongoose';

export const FormSchema = new mongoose.Schema({
	type: String,
	teams: String,
	score: String,
	date: String,
});

export const TeamResultSchema = new mongoose.Schema({
	teamId: Number,
	url: String,
	wins: Number,
	draws: Number,
	losses: Number,
	scored: Number,
	conceded: Number,
	points: Number,
	forms: [FormSchema],
});

export const LeagueTableSchema = new mongoose.Schema({
	leagueId: Number,
	table: [TeamResultSchema],
	season: String,
});

interface Form {
	type: string;
	teams: string;
	score: string;
	date: string;
}
interface TeamResult {
	url: string;
	wins: number;
	draws: number;
	losses: number;
	scored: number;
	conceded: number;
	points: number;
	forms: Form[];
}

export interface LeagueTable extends Document {
	leagueId: number;
	table: TeamResult[];
	season: string;
}
