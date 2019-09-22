import React, { useEffect } from 'react';
import { Loader, Grid, Header, Button, Dimmer } from 'semantic-ui-react';
import GridColumn from 'semantic-ui-react/dist/commonjs/collections/Grid/GridColumn';
import { PlayerDto } from '@shared/lib/dtos/player/player.dto';
import { ILineupState, lineupReducer } from '@web/features/lineup/store/reducers/lineup-reducer';
import { connect } from 'react-redux';
import { compose } from '@shared/lib/utils/fp/combine';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { playerReducer } from '@web/features/players/store/reducers/player-reducer';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { playerEpic } from '@web/features/players/store/epics';
import { loadPlayers } from '@web/features/players/store/actions';
import {
	addPlayerToLineup,
	clearLineupPosition,
	fillPositions,
	removePlayerFromLineup,
	swapPlayers,
} from '@web/features/lineup/store/actions';
import { addPlayerToLineupEpic, fillPositionsEpic, removePlayerFromLineupEpic } from '@web/features/lineup/store/epics';
import { SwLineup } from './Lineup';
import { SwPitch } from './Pitch';

interface IProps {
	players: PlayerDto[];
	lineup: ILineupState;
	loadPlayers: typeof loadPlayers;
	addPlayerToLineup: typeof addPlayerToLineup;
	removePlayerFromLineup: typeof removePlayerFromLineup;
	clearLineupPosition: typeof clearLineupPosition;
	swapPlayers: typeof swapPlayers;
	fillPositions: typeof fillPositions;
}

const SwLineupBuilderComponent: React.FC<IProps> = function({
	players,
	lineup,
	loadPlayers,
	addPlayerToLineup,
	swapPlayers,
	removePlayerFromLineup,
	clearLineupPosition,
	fillPositions,
}) {
	useEffect(() => {
		loadPlayers();
	}, [loadPlayers]);
	return (
		<>
			<Header as={'h2'}>Manchester United</Header>
			<div className={'ub-mb3'}>
				<Button primary onClick={() => fillPositions()}>
					Fill
				</Button>
			</div>
			<Grid stackable>
				<GridColumn tablet={'7'}>
					<SwLineup players={players} />
				</GridColumn>
				<GridColumn tablet={'9'}>
					<SwPitch
						strategy={lineup.strategy}
						positions={lineup.positions}
						onAddPlayerToLineup={(player, index) => addPlayerToLineup({ player, index })}
						onRemovePlayerFromLineup={(player, index) =>
							removePlayerFromLineup({ removedPlayer: player, index })
						}
						onClearPlayerPosition={clearLineupPosition}
						onSwapPlayers={(source, dest) => swapPlayers({ first: source, second: dest })}
					/>
				</GridColumn>
			</Grid>
		</>
	);
};

const enhance = compose(
	registerReducer({ lineup: lineupReducer, playerList: playerReducer }),
	registerEpic(playerEpic, addPlayerToLineupEpic, removePlayerFromLineupEpic, fillPositionsEpic),
	connect(
		state => ({ players: state.playerList.players, lineup: state.lineup }),
		{ loadPlayers, addPlayerToLineup, removePlayerFromLineup, swapPlayers, clearLineupPosition, fillPositions }
	)
);
export const SwLineupBuilder = enhance(SwLineupBuilderComponent);
