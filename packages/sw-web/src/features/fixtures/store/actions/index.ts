import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import {
	FETCH_UPCOMING_FIXTURES_FOR_TEAMS,
	FETCH_UPCOMING_FIXTURES_FOR_TEAMS_SUCCESS,
	FETCH_WEEKLY_FIXTURE_FOR_TEAMS_SUCCESS,
	FETCH_WEEKLY_FIXTURES_FOR_TEAMS,
} from '@web/features/fixtures/store/actions/actions.constants';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';

export const fetchUpcomingFixturesForTeamsSuccess = createSwStandardAction(FETCH_UPCOMING_FIXTURES_FOR_TEAMS_SUCCESS)<{
	[key: number]: FixtureDto;
}>();

export const fetchWeeklyFixturesForTeamsSuccess = createSwStandardAction(FETCH_WEEKLY_FIXTURE_FOR_TEAMS_SUCCESS)<{
	[key: number]: FixtureDto;
}>();

export const fetchUpcomingFixturesForTeams = createSwStandardAction(FETCH_UPCOMING_FIXTURES_FOR_TEAMS)<number[]>();

export const fetchWeeklyFixturesForTeams = createSwStandardAction(FETCH_WEEKLY_FIXTURES_FOR_TEAMS)<number[]>();
