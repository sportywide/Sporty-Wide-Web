import React from 'react';
import { Form } from 'semantic-ui-react';
import { Formik } from 'formik';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { UserDto } from '@shared/lib/dtos/user/user.dto';

interface IProps {
	user: UserDto;
}
const SwSummaryProfileComponent: React.FC<IProps> = ({ user }) => {
	return (
		<Formik
			initialValues={{}}
			onSubmit={console.log}
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
