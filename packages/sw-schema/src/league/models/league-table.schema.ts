import mongoose, { Document } from 'mongoose';
import { LeagueStandingsDto } from '@root/packages/sw-shared/src/lib/dtos/leagues/league-standings.dto';
import { Diff, Interface, MongooseDocument } from '@shared/lib/utils/types';

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
	played: Number,
	name: String,
	points: Number,
	forms: [FormSchema],
});

export const LeagueTableSchema = new mongoose.Schema({
	leagueId: Number,
	table: [TeamResultSchema],
	season: String,
});

export interface LeagueTableDocument extends Diff<LeagueStandingsDto, MongooseDocument>, Document {}
