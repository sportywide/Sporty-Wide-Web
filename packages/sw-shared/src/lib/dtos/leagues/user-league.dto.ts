import { Type } from 'class-transformer-imp';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';

export class UserLeagueDto extends LeagueDto {
	@Type(() => Date)
	createdAt: Date;
}

export class SelectableLeagueDto extends UserLeagueDto {
	selected: boolean;
}
