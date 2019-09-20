import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import { LOAD_PLAYER_SUCCESS, LOAD_PLAYERS } from '@web/features/players/store/actions/actions.constants';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';

export const loadPlayers = createSwStandardAction(LOAD_PLAYERS)();
export const loadPlayersSuccess = createSwStandardAction(LOAD_PLAYER_SUCCESS)<PlayerDto[]>();
