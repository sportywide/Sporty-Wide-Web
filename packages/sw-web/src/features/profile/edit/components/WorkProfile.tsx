import React from 'react';
import { Form, Header, Image } from 'semantic-ui-react';
import { Formik } from 'formik';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { IUser } from '@web/shared/lib/interfaces/auth/user';

interface IProps {
	user: IUser;
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
