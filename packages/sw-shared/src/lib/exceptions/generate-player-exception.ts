import { BusinessException } from '@shared/lib/exceptions/business-exception';

export const NOT_IN_SEASON_CODE = 'not_in_season';
export const NOT_ENOUGH_FIXTURES = 'not_enough_fixtures';
export const NOT_IN_WEEKDAY = 'not_in_weekday';
export const NOT_PLAYING = 'not_playing';

export class NotPlayingException extends BusinessException {
	constructor(message) {
		super(message, NOT_PLAYING);
	}
}

export class NotInWeekDayException extends BusinessException {
	constructor(message) {
		super(message, NOT_IN_WEEKDAY);
	}
}

export class NotEnoughFixturesException extends BusinessException {
	constructor(message) {
		super(message, NOT_ENOUGH_FIXTURES);
	}
}

export class NotInSeasonException extends BusinessException {
	constructor(message) {
		super(message, NOT_IN_SEASON_CODE);
	}
}
