import { PlayerDto } from '@shared/lib/dtos/player/player.dto';

const ordering = {
	GK: 1,
	LB: 2,
	CB: 3,
	RB: 3,
	DM: 4,
	CM: 5,
	LM: 6,
	RM: 7,
	AM: 8,
	LW: 9,
	RW: 10,
	SS: 11,
	ST: 12,
	CF: 12,
};

export const NUM_PLAYERS = 11;

export function sortPlayers(players) {
	return players.sort((a: PlayerDto, b: PlayerDto) => {
		const aPosition = ordering[a.positions[0]];
		const bPosition = ordering[b.positions[0]];
		if (aPosition === bPosition) {
			return b.rating - a.rating;
		}
		return aPosition - bPosition;
	});
}
