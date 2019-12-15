import mongoose, { Document } from 'mongoose';
import { Diff, MongooseDocument } from '@shared/lib/utils/types';
import { PlayerRatingDto } from '@shared/lib/dtos/player/player-rating.dto';

export const PlayerRatingSchema = new mongoose.Schema({
	playerId: Number,
	fixtureId: Number,
	rating: Number,
	touches: Number,
	shotsTotal: Number,
	shotsOnTarget: Number,
	keyPassTotal: Number,
	passSuccessInMatch: Number,
	duelAerialWon: Number,
});

PlayerRatingSchema.index({
	playerId: 1,
	fixtureId: 1,
});

export interface PlayerRatingDocument extends Diff<PlayerRatingDto, MongooseDocument>, Document {}
