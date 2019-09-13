import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';
import { Formik } from 'formik';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { UserProfileDto } from '@shared/lib/dtos/user/profile/user-profile.dto';
import { SwCountrySelect } from '@web/features/address/components/CountrySelect';
import { SwStateSelect } from '@web/features/address/components/StateSelect';
import { SwCitySelect } from '@web/features/address/components/CitySelect';

interface IProps {
	profile: UserProfileDto;
	didSaveProfile: (user: UserProfileDto) => void;
}
const SwWorkProfileComponent: React.FC<IProps> = ({ profile, didSaveProfile }) => {
	const [countryId, setCountryId] = useState<number | null | undefined>(undefined);
	const [stateId, setStateId] = useState<number | null | undefined>(undefined);
	return (
		profile && (
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
								{stateId !== undefined && (
									<SwCitySelect
										name="address.city"
										label={'City'}
										placeholder={'Your City'}
										stateId={stateId}
									/>
								)}

								{countryId !== undefined && (
									<SwStateSelect
										name={'address.state'}
										label={'State'}
										placeholder={'Your State'}
										countryId={countryId}
										onStateChange={state => {
											setStateId((state && state.id) as number);
										}}
									/>
								)}

								<SwCountrySelect
									name={'address.country'}
									label={'Country'}
									placeholder={'Your country'}
									onCountryChange={country => {
										setCountryId(country && country.id);
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
		)
	);
};
export const SwWorkProfile = SwWorkProfileComponent;
