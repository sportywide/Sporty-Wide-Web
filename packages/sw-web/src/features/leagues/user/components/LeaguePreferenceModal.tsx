import React, { memo, useState } from 'react';
import { Button, Modal, Select } from 'semantic-ui-react';
import { noop } from '@shared/lib/utils/functions';
import { useFormationOptions } from '@web/shared/lib/react/hooks';
import { connect } from 'react-redux';
import { compose } from '@shared/lib/utils/fp/combine';
import { registerEpic } from '@web/shared/lib/redux/register-epic';
import { joinUserLeagueEpic } from '@web/features/leagues/user/store/epics';
import { joinUserLeague } from '@web/features/leagues/user/store/actions';
import { LeagueDto } from '@shared/lib/dtos/leagues/league.dto';
import { FormationName } from '@shared/lib/dtos/formation/formation.dto';

interface IProps {
	onClose: () => void;
	popupState: {
		userId: number;
		league: LeagueDto;
	};
	joinUserLeague: typeof joinUserLeague;
}
const LeaguePreferenceModalComponent: React.FC<IProps> = function({
	onClose = noop,
	popupState: { userId, league },
	joinUserLeague,
}) {
	const [formation, setFormation] = useState<FormationName>('4-4-2');
	const formationOptions = useFormationOptions();
	return (
		<>
			<Modal.Header>League</Modal.Header>
			<Modal.Content>
				<div>Select your favorite formation</div>
				<Select
					className={'sw-mr2 sw-mt2'}
					value={formation}
					options={formationOptions}
					onChange={(e, { value }) => setFormation(value as FormationName)}
				/>
			</Modal.Content>
			<Modal.Actions>
				<Button onClick={() => joinUserLeague({ leagueId: league.id, userId, formation })} positive>
					Play
				</Button>
				<Button onClick={() => onClose()} negative>
					Close
				</Button>
			</Modal.Actions>
		</>
	);
};

const enhancer = compose(
	registerEpic(joinUserLeagueEpic),
	connect(
		null,
		{
			joinUserLeague,
		}
	),
	memo
);

export const LeaguePreferenceModal = enhancer(LeaguePreferenceModalComponent);
