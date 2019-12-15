import { MongooseDocument } from '@shared/lib/utils/types';

export class PlayerRatingDto {
	playerId: number;
	fixtureId: number;
}

export interface PlayerRatingDto extends PlayerRating, MongooseDocument {}

export class PlayerRating {
	rating: number;
	touches: number;
	shotsTotal: number;
	shotsOnTarget: number;
	keyPassTotal: number;
	passSuccessInMatch: number;
	duelAerialWon: number;
}

export class WhoscorePlayerRating extends PlayerRating {
	shirt: number;
	name: string;
	position: string;
}
