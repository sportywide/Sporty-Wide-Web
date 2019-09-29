import { Expose, Type } from 'class-transformer-imp';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';

export class UserLeagueDto extends LeagueDto {
	@Expose()
	@Type(type => Date)
	createdAt: Date;
}
