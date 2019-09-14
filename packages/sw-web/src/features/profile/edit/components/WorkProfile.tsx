import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';
import { Formik } from 'formik';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { UserProfileDto } from '@shared/lib/dtos/user/profile/user-profile.dto';
import { SwAddressForm } from '@web/shared/lib/form/components/address/AddressForm';
import { AddressDto } from '@shared/lib/dtos/address/address.dto';

interface IProps {
	profile: UserProfileDto;
	didSaveProfile: (user: UserProfileDto) => void;
}
const SwWorkProfileComponent: React.FC<IProps> = ({ profile, didSaveProfile }) => {
	const [isLookupAddress, setIsLookupAddress] = useState(false);

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
							<SwAddressForm
								onToggleAutoCompleteField={setIsLookupAddress}
								isShowingAutoComplete={isLookupAddress}
								didSelectAddress={() => {
									setIsLookupAddress(false);
								}}
							/>
							<Form.Button type="submit" primary disabled={!props.isValid || isLookupAddress}>
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
