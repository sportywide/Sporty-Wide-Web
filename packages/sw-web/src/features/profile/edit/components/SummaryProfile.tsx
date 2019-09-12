import React from 'react';
import { Form } from 'semantic-ui-react';
import { Formik } from 'formik';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { UserProfileDto } from '@shared/lib/dtos/user/profile/user-profile.dto';

interface IProps {
	profile: UserProfileDto;
	didSaveProfile: (user: UserProfileDto) => void;
}
const SwSummaryProfileComponent: React.FC<IProps> = ({ profile, didSaveProfile }) => {
	return (
		<Formik
			initialValues={profile}
			onSubmit={didSaveProfile}
			enableReinitialize={true}
			render={props => {
				return (
					<Form onSubmit={props.handleSubmit}>
						<SwFormField
							component={Form.TextArea}
							componentProps={{
								label: 'Summary',
								placeholder: 'Your Summary',
							}}
							name="summary"
						/>
						<Form.Button type="submit" primary disabled={!props.isValid}>
							Save
						</Form.Button>
					</Form>
				);
			}}
		/>
	);
};
export const SwSummaryProfile = SwSummaryProfileComponent;
