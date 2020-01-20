import { MongooseDocument } from '@shared/lib/utils/types';

export class UserLeaguePreferenceDto extends MongooseDocument {
	userId: number;
	formation: string;
	leagueId: string;
}
