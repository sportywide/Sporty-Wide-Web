import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';

export class PlayerBettingDto {
	betRating: number;
	newBetRating: number;
	pos: number;
	realRating: number;
	betTokens: number;
	newBetTokens: number;
	earnedTokens: number;
	calculated: boolean;
	week: string;
	fixtureId: number;
	userId: number;
	playerId: number;
	teamId: number;
	leagueId: number;
	fixture: FixtureDto;
	user: UserDto;
	player: PlayerDto;
}
