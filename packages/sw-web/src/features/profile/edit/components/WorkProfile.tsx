import React from 'react';
import { Form, Header, Image } from 'semantic-ui-react';
import { Formik } from 'formik';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { UserGender } from '@shared/lib/dtos/user/enum/user-gender.enum';

interface IProps {
	user: UserDto;
}
const SwWorkProfileComponent: React.FC<IProps> = ({ user }) => {
	return (
		<Formik
			initialValues={{}}
			onSubmit={console.log}
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
							name="workplace"
						/>
						<SwFormField
							component={Form.Input}
							componentProps={{
								icon: 'university',
								label: 'School',
								placeholder: 'Your school',
							}}
							name="school"
						/>
						<SwFormField
							component={Form.Input}
							componentProps={{
								label: 'Address 1',
								placeholder: 'Address 1',
							}}
							name="street1"
						/>
						<SwFormField
							component={Form.Input}
							componentProps={{
								label: 'Address 2',
								placeholder: 'Address 2',
							}}
							name="street2"
						/>
						<Form.Group widths="equal">
							<SwFormField
								name="suburb"
								component={Form.Input}
								componentProps={{
									label: 'Suburb',
									placeholder: 'Your suburb',
								}}
							/>
							<SwFormField
								name="postcode"
								component={Form.Input}
								componentProps={{
									label: 'Postcode',
									placeholder: 'Your postcode',
								}}
							/>
						</Form.Group>
						<Form.Group widths="equal">
							<SwFormField
								name="city"
								component={Form.Input}
								componentProps={{
									label: 'City',
									placeholder: 'Your city',
								}}
							/>
							<SwFormField
								name="state"
								component={Form.Input}
								componentProps={{
									label: 'State',
									placeholder: 'Your state',
								}}
							/>

							<SwFormField
								name="country"
								component={Form.Select}
								componentProps={{
									label: 'Country',
									placeholder: 'Your country',
								}}
							/>
						</Form.Group>
					</Form>
				);
			}}
		/>
	);
};
export const SwWorkProfile = SwWorkProfileComponent;
