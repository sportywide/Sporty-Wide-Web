import React, { useEffect } from 'react';
import { Button, Grid, Header, Form, Select } from 'semantic-ui-react';
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
	changeStrategy,
	clearLineup,
	fillPositions,
	removePlayerFromLineup,
	substitutePlayer,
	swapPlayers,
	switchLineupPositions,
} from '@web/features/lineup/store/actions';
import {
	addPlayerToLineupEpic,
	changeStrategyEpic,
	clearLineupEpic,
	fillPositionsEpic,
	removePlayerFromLineupEpic,
	substitutePlayerEpic,
} from '@web/features/lineup/store/epics';
import { SwLineup } from './Lineup';
import { SwPitch } from './Pitch';

interface IProps {
	players: PlayerDto[];
	lineup: ILineupState;
	loadPlayers: typeof loadPlayers;
	addPlayerToLineup: typeof addPlayerToLineup;
	removePlayerFromLineup: typeof removePlayerFromLineup;
	swapPlayers: typeof swapPlayers;
	fillPositions: typeof fillPositions;
	switchLineupPositions: typeof switchLineupPositions;
	substitutePlayer: typeof substitutePlayer;
	clearLineup: typeof clearLineup;
	changeStrategy: typeof changeStrategy;
}

const SwLineupBuilderComponent: React.FC<IProps> = function({
	players,
	lineup,
	loadPlayers,
	addPlayerToLineup,
	swapPlayers,
	removePlayerFromLineup,
	fillPositions,
	switchLineupPositions,
	substitutePlayer,
	clearLineup,
	changeStrategy,
}) {
	useEffect(() => {
		loadPlayers();
	}, [loadPlayers]);
	return (
		<>
			<Header as={'h2'}>Manchester United</Header>
			<div className={'ub-mb3'}>
				<Select
					className={'ub-mr2'}
					defaultValue={'4-4-2'}
					options={[
						{
							text: '4-4-2',
							value: '4-4-2',
						},
						{
							text: '4-3-3',
							value: '4-3-3',
						},
					]}
					onChange={(e, { value }) => changeStrategy(value as string)}
				/>
				<Button primary onClick={() => fillPositions()}>
					Fill
				</Button>
				<Button negative onClick={() => clearLineup()}>
					Clear
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
						onRemovePlayerFromLineup={player => removePlayerFromLineup(player)}
						onSubstitutePlayer={(source, dest) => substitutePlayer({ first: source, second: dest })}
						onSwitchLineupPosition={(player, index) => switchLineupPositions({ player, index })}
						onSwapPlayers={(source, dest) => swapPlayers({ first: source, second: dest })}
					/>
				</GridColumn>
			</Grid>
		</>
	);
};

const enhance = compose(
	registerReducer({ lineup: lineupReducer, playerList: playerReducer }),
	registerEpic(
		playerEpic,
		addPlayerToLineupEpic,
		clearLineupEpic,
		removePlayerFromLineupEpic,
		fillPositionsEpic,
		substitutePlayerEpic,
		changeStrategyEpic
	),
	connect(
		state => ({ players: state.playerList.players, lineup: state.lineup }),
		{
			loadPlayers,
			addPlayerToLineup,
			removePlayerFromLineup,
			substitutePlayer,
			swapPlayers,
			clearLineup,
			switchLineupPositions,
			fillPositions,
			changeStrategy,
		}
	)
);
export const SwLineupBuilder = enhance(SwLineupBuilderComponent);
