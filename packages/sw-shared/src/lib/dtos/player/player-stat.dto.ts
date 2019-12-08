import { MongooseDocument } from '@shared/lib/utils/types';
import { Expose } from 'class-transformer-imp';

export class PlayerStatDto extends MongooseDocument {
	@Expose()
	scored: number;
	@Expose()
	yellow: number;
	@Expose()
	red: number;
	@Expose()
	played: number;
	@Expose()
	playerId: number;
	@Expose()
	season: string;
}
