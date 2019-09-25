import React, { useEffect } from 'react';
import { Button, Grid, Header, Select } from 'semantic-ui-react';
import GridColumn from 'semantic-ui-react/dist/commonjs/collections/Grid/GridColumn';
import { ILineupState, lineupReducer } from '@web/features/lineup/store/reducers/lineup-reducer';
import { connect } from 'react-redux';
import { compose } from '@shared/lib/utils/fp/combine';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import {
	addPlayerToLineup,
	changeStrategy,
	clearLineup,
	fillPositions,
	loadPlayers,
	removePlayerFromLineup,
	substitutePlayers,
	swapPlayers,
	switchLineupPositions,
} from '@web/features/lineup/store/actions';
import {
	changeStrategyEpic,
	fillPositionsEpic,
	playerEpic,
	substitutePlayersEpic,
} from '@web/features/lineup/store/epics';
import { SwLineup } from './Lineup';
import { SwPitch } from './Pitch';

interface IProps {
	lineupBuilder: ILineupState;
	loadPlayers: typeof loadPlayers;
	addPlayerToLineup: typeof addPlayerToLineup;
	removePlayerFromLineup: typeof removePlayerFromLineup;
	swapPlayers: typeof swapPlayers;
	fillPositions: typeof fillPositions;
	switchLineupPositions: typeof switchLineupPositions;
	substitutePlayers: typeof substitutePlayers;
	clearLineup: typeof clearLineup;
	changeStrategy: typeof changeStrategy;
}

const SwLineupBuilderComponent: React.FC<IProps> = function({
	lineupBuilder,
	loadPlayers,
	addPlayerToLineup,
	swapPlayers,
	removePlayerFromLineup,
	fillPositions,
	switchLineupPositions,
	substitutePlayers,
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
					<SwLineup players={lineupBuilder.players} />
				</GridColumn>
				<GridColumn tablet={'9'}>
					<SwPitch
						strategy={lineupBuilder.strategy}
						positions={lineupBuilder.positions}
						onAddPlayerToLineup={(player, index) => addPlayerToLineup({ player, index })}
						onRemovePlayerFromLineup={player => removePlayerFromLineup(player)}
						onSubstitutePlayer={(source, dest) => substitutePlayers({ first: source, second: dest })}
						onSwitchLineupPosition={(player, index) => switchLineupPositions({ player, index })}
						onSwapPlayers={(source, dest) => swapPlayers({ first: source, second: dest })}
					/>
				</GridColumn>
			</Grid>
		</>
	);
};

const enhance = compose(
	registerReducer({ lineupBuilder: lineupReducer }),
	registerEpic(playerEpic, fillPositionsEpic, changeStrategyEpic, substitutePlayersEpic),
	connect(
		state => ({ lineupBuilder: state.lineupBuilder }),
		{
			loadPlayers,
			addPlayerToLineup,
			removePlayerFromLineup,
			substitutePlayers,
			swapPlayers,
			clearLineup,
			switchLineupPositions,
			fillPositions,
			changeStrategy,
		}
	)
);
export const SwLineupBuilder = enhance(SwLineupBuilderComponent);
