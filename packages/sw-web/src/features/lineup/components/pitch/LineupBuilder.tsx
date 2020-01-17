import React, { useEffect } from 'react';
import { Button, Grid, Select } from 'semantic-ui-react';
import GridColumn from 'semantic-ui-react/dist/commonjs/collections/Grid/GridColumn';
import { ILineupState, IPlayerLineupState, lineupReducer } from '@web/features/lineup/store/reducers/lineup-reducer';
import { connect } from 'react-redux';
import { compose } from '@shared/lib/utils/fp/combine';
import { registerReducer } from '@web/shared/lib/redux/register-reducer';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import {
	addPlayerToLineup,
	changeStrategy,
	clearLineup,
	fillPositions,
	initLineup,
	removePlayerFromLineup,
	substitutePlayers,
	swapPlayers,
	switchLineupPositions,
} from '@web/features/lineup/store/actions';
import { changeStrategyEpic, fillPositionsEpic, substitutePlayersEpic } from '@web/features/lineup/store/epics';
import { useFormationOptions } from '@web/shared/lib/react/hooks';
import { LineupControl } from '@web/features/lineup/components/pitch/LineupBuilder.styled';
import { SwLineup } from './Lineup';
import { SwPitch } from './Pitch';

interface IProps {
	lineupBuilder: ILineupState;
	initialLineup: IPlayerLineupState;
	initLineup: typeof initLineup;
	addPlayerToLineup: typeof addPlayerToLineup;
	removePlayerFromLineup: typeof removePlayerFromLineup;
	swapPlayers: typeof swapPlayers;
	fillPositions: typeof fillPositions;
	switchLineupPositions: typeof switchLineupPositions;
	substitutePlayers: typeof substitutePlayers;
	clearLineup: typeof clearLineup;
	changeStrategy: typeof changeStrategy;
	leagueId: number;
	readonly?: boolean;
}

const SwLineupBuilderComponent: React.FC<IProps> = function({
	lineupBuilder,
	addPlayerToLineup,
	initLineup,
	initialLineup,
	swapPlayers,
	removePlayerFromLineup,
	fillPositions,
	switchLineupPositions,
	substitutePlayers,
	clearLineup,
	changeStrategy,
	readonly,
}) {
	useEffect(() => {
		initLineup(initialLineup);
	}, [initLineup, initialLineup]);
	const options = useFormationOptions();
	return (
		<>
			<div>
				{!readonly && (
					<LineupControl className={'sw-mb3'}>
						{lineupBuilder.formation && (
							<Select
								className={'sw-mr2 sw-mb2'}
								defaultValue={lineupBuilder.formation}
								options={options}
								onChange={(e, { value }) => changeStrategy(value as string)}
							/>
						)}
						<Button primary onClick={() => fillPositions()}>
							Fill
						</Button>
						<Button negative onClick={() => clearLineup()}>
							Clear
						</Button>
					</LineupControl>
				)}
			</div>
			<Grid stackable>
				<GridColumn tablet={'7'}>
					<SwLineup readonly={readonly} players={lineupBuilder.players} />
				</GridColumn>
				<GridColumn tablet={'9'}>
					<SwPitch
						readonly={readonly}
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
	registerEpic(fillPositionsEpic, changeStrategyEpic, substitutePlayersEpic),
	connect(state => ({ lineupBuilder: state.lineupBuilder }), {
		initLineup,
		addPlayerToLineup,
		removePlayerFromLineup,
		substitutePlayers,
		swapPlayers,
		clearLineup,
		switchLineupPositions,
		fillPositions,
		changeStrategy,
	})
);
export const SwLineupBuilder = enhance(SwLineupBuilderComponent);
