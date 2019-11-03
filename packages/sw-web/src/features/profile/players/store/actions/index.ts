import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { UserProfileDto } from '@shared/lib/dtos/user/profile/user-profile.dto';
import { FETCH_PROFILE_PLAYERS_SUCCESS, FETCH_PROFILE_PLAYERS } from './actions.constants';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';

export const fetchProfilePlayersSuccess = createSwStandardAction(FETCH_PROFILE_PLAYERS_SUCCESS)<PlayerDto[]>();
export const fetchProfilePlayers = createSwStandardAction(FETCH_PROFILE_PLAYERS)<number>();
