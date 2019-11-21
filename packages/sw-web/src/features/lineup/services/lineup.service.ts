import { Service } from 'typedi';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { FormationDto, formationMap } from '@shared/lib/dtos/formation/formation.dto';

@Service()
export class LineupService {
	fillPositions({
		positions,
		strategy,
		players,
	}: {
		positions: (PlayerDto | null)[];
		players: PlayerDto[];
		strategy: FormationDto;
	}) {
		const filledPositions = [...positions];
		const playerByPosition: { [key: string]: PlayerDto[] } = players.reduce((currentMap, player) => {
			if (positions.includes(player)) {
				return currentMap;
			}
			player.positions.forEach(position => {
				(currentMap[position] = currentMap[position] || []).push(player);
			});
			return currentMap;
		}, {});
		Object.keys(playerByPosition).forEach(position => {
			playerByPosition[position] = playerByPosition[position].sort((a, b) => {
				return b.rating - a.rating;
			});
		});
		strategy.formation.forEach((desiredPosition, index) => {
			//position already filled
			if (positions[index]) {
				return;
			}
			//no available player for this position
			if (!(playerByPosition[desiredPosition.name] && playerByPosition[desiredPosition.name].length)) {
				return;
			}
			let bestPlayer = playerByPosition[desiredPosition.name][0];

			for (const availablePlayer of playerByPosition[desiredPosition.name]) {
				const capablePositions = availablePlayer.positions;
				if (!(capablePositions && capablePositions.length)) {
					continue;
				}
				let bestFit = true;
				for (const capablePosition of capablePositions) {
					let isNeeded = false;
					for (let j = index + 1; j < strategy.formation.length; j++) {
						if (!positions[j] && strategy.formation[j].name === capablePosition) {
							isNeeded = true;
							break;
						}
					}
					if (!isNeeded) {
						continue;
					}
					if (playerByPosition[capablePosition].length <= 1) {
						bestFit = false;
						break;
					}
				}
				if (bestFit) {
					bestPlayer = availablePlayer;
					break;
				}
			}

			markPlayerAsUnavailable(bestPlayer);
			filledPositions[index] = bestPlayer;
		});

		return filledPositions;

		function markPlayerAsUnavailable(player) {
			player.positions.forEach(position => {
				playerByPosition[position] = playerByPosition[position].filter(
					currentPlayer => player !== currentPlayer
				);
			});
		}
	}

	getFormation(name): FormationDto {
		return formationMap[name];
	}
}
