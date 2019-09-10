import React from 'react';
import { Form, Header, Image } from 'semantic-ui-react';
import { Formik } from 'formik';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { UserDto } from '@shared/lib/dtos/user/user.dto';

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
					</Form>
				);
			}}
		/>
	);
};
export const SwWorkProfile = SwWorkProfileComponent;
