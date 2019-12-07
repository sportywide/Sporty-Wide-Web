import mongoose, { Document } from 'mongoose';
import { Diff, MongooseDocument } from '@shared/lib/utils/types';
import { PlayerStatDto } from '@shared/lib/dtos/player/player-stat.dto';

export const PlayerStatSchema = new mongoose.Schema({
	playerId: Number,
	played: Number,
	scored: Number,
	yellow: Number,
	red: Number,
	status: String,
	season: String,
});

PlayerStatSchema.index({
	playerId: 1,
	season: 1,
});

export interface PlayerStatDocument extends Diff<PlayerStatDto, MongooseDocument>, Document {}
