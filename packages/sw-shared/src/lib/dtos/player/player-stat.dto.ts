import { MongooseDocument } from '@shared/lib/utils/types';

export class PlayerStatDto extends MongooseDocument {
	scored: number;
	yellow: number;
	red: number;
	played: number;
	playerId: number;
	season: string;
}
