import React from 'react';
import { Form } from 'semantic-ui-react';
import { Formik } from 'formik';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { UserProfileDto } from '@shared/lib/dtos/user/profile/user-profile.dto';

interface IProps {
	profile: UserProfileDto;
	didSaveProfile: (user: UserProfileDto) => void;
}
const SwWorkProfileComponent: React.FC<IProps> = ({ profile, didSaveProfile }) => {
	return (
		<Formik
			initialValues={profile}
			enableReinitialize={true}
			onSubmit={didSaveProfile}
			render={props => {
				return (
					<Form onSubmit={props.handleSubmit}>
						<SwFormField
							component={Form.Input}
							componentProps={{
								icon: 'table',
								label: 'Workplace',
								placeholder: 'Your workplace',
							}}
							name="work"
						/>
						<SwFormField
							component={Form.Input}
							componentProps={{
								icon: 'university',
								label: 'School',
								placeholder: 'Your school',
							}}
							name="education"
						/>
						<SwFormField
							component={Form.Input}
							componentProps={{
								label: 'Address 1',
								placeholder: 'Address 1',
							}}
							name="address.street1"
						/>
						<SwFormField
							component={Form.Input}
							componentProps={{
								label: 'Address 2',
								placeholder: 'Address 2',
							}}
							name="address.street2"
						/>
						<Form.Group widths="equal">
							<SwFormField
								name="address.suburb"
								component={Form.Input}
								componentProps={{
									label: 'Suburb',
									placeholder: 'Your suburb',
								}}
							/>
							<SwFormField
								name="address.postcode"
								component={Form.Input}
								componentProps={{
									label: 'Postcode',
									placeholder: 'Your postcode',
								}}
							/>
						</Form.Group>
						<Form.Group widths="equal">
							<SwFormField
								name="address.city"
								component={Form.Input}
								componentProps={{
									label: 'City',
									placeholder: 'Your city',
								}}
							/>
							<SwFormField
								name="address.state"
								component={Form.Input}
								componentProps={{
									label: 'State',
									placeholder: 'Your state',
								}}
							/>

							<SwFormField
								name="address.country"
								component={Form.Input}
								componentProps={{
									label: 'Country',
									placeholder: 'Your country',
								}}
							/>
						</Form.Group>
						<Form.Button type="submit" primary disabled={!props.isValid}>
							Save
						</Form.Button>
					</Form>
				);
			}}
		/>
	);
};
export const SwWorkProfile = SwWorkProfileComponent;
