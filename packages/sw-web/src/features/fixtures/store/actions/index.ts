import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import {
	FETCH_UPCOMING_FIXTURES,
	FETCH_UPCOMING_FIXTURES_SUCCESS,
} from '@web/features/fixtures/store/actions/actions.constants';
import { FixtureDto } from '@shared/lib/dtos/fixture/fixture.dto';

export const fetchUpcomingFixtures = createSwStandardAction(FETCH_UPCOMING_FIXTURES)<number[]>();

export const fetchUpcomingFixturesSuccess = createSwStandardAction(FETCH_UPCOMING_FIXTURES_SUCCESS)<{
	[key: number]: FixtureDto;
}>();
