import React from 'react';
import { Formik, FormikProps } from 'formik';
import { Form } from 'semantic-ui-react';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { SwPasswordField } from '@web/shared/lib/form/components/PasswordField';
import { getSchemaByType } from 'yup-decorator';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';

interface IProps {
	onSignup: (userDto: CreateUserDto) => void;
}

const SwSignupFormComponent: React.FC<IProps> = props => {
	const handleSignup = values => {
		props.onSignup(values);
	};

	return (
		<Formik initialValues={{}} onSubmit={handleSignup} validationSchema={getSchemaByType(CreateUserDto)}>
			{renderForm}
		</Formik>
	);

	function renderForm(props: FormikProps<any>) {
		return (
			<div className="ub-mb2">
				<Form className="ui form" onSubmit={props.handleSubmit}>
					<div className="two fields">
						<SwFormField
							name="firstName"
							component={Form.Input}
							componentProps={{
								label: 'First name',
								type: 'text',
								placeholder: 'First name',
							}}
						/>
						<SwFormField
							name="lastName"
							component={Form.Input}
							componentProps={{
								label: 'Last name',
								type: 'text',
								placeholder: 'Last name',
							}}
						/>
					</div>

					<div className="field">
						<SwFormField
							name="email"
							component={Form.Input}
							componentProps={{
								label: 'Email',
								type: 'email',
								placeholder: 'Email',
							}}
						/>
					</div>

					<div className="field">
						<SwFormField
							name="username"
							component={Form.Input}
							componentProps={{
								label: 'Username',
								type: 'text',
								placeholder: 'Username',
							}}
						/>
					</div>

					<div className="field">
						<SwPasswordField
							name="password"
							componentProps={{
								label: 'Password',
								placeholder: 'Your password',
							}}
						/>
					</div>

					<div className="field">
						<SwFormField
							name="confirmPassword"
							component={Form.Input}
							componentProps={{
								label: 'Confirm Password',
								type: 'password',
								placeholder: 'Confirm Your password',
							}}
						/>
					</div>

					<button className="ui primary button" disabled={!props.isValid} onClick={props.submitForm}>
						Signup
					</button>
				</Form>
			</div>
		);
	}
};
export const SwSignupForm = SwSignupFormComponent;
