function getRatingFactor(rating) {
	if (rating >= 80) {
		return 1;
	}
	if (rating <= 65) {
		return 0;
	}
	return 1 - (80 - rating) / 15;
}

function getAgeFactor(age) {
	let ageFactor;
	if (Math.abs(age - 25) >= 7) {
		ageFactor = 0;
	} else {
		ageFactor = 1 - Math.abs(age - 25) / 7;
	}
	return ageFactor;
}

function getPlayedFactor(played, totalGames) {
	if (!totalGames) {
		return 0;
	}
	if (totalGames >= 6 && played / totalGames >= 0.45) {
		return 1;
	}
	if (totalGames <= 6) {
		return (played + 7) / (totalGames + 7);
	} else if (totalGames <= 10) {
		return (played + 5) / (totalGames + 5);
	} else {
		return (played + 3) / (totalGames + 3);
	}
}

export function calculateChance({
	player: { age, rating, played },
	totalGames,
}: {
	totalGames: number;
	player: { age: number; rating: number; played: number };
}) {
	const ageFactor = getAgeFactor(age);
	const ratingFactor = getRatingFactor(rating);
	if (totalGames) {
		const playedFactor = getPlayedFactor(played, totalGames);
		return playedFactor * 0.45 + ageFactor * 0.25 + ratingFactor * 0.3;
	} else {
		return ageFactor * 0.3 + ratingFactor * 0.7;
	}
}
