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
	shotsOffTarget: number;
	tacklesTotal: number;
	tackleSuccessful: number;
	keyPassTotal: number;
	totalPasses: number;
	passesAccurate: number;
	duelAerialTotal: number;
	duelAerialWon: number;
}

export class WhoscorePlayerRating extends PlayerRating {
	shirt: number;
	name: string;
	position: string;
}
