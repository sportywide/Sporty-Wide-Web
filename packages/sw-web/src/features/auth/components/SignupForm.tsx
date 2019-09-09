import React from 'react';
import { Formik, FormikProps } from 'formik';
import { Form } from 'semantic-ui-react';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { SwPasswordField } from '@web/shared/lib/form/components/PasswordField';
import { getSchemaByType } from 'yup-decorator';
import { SignupDto } from '@shared/lib/dtos/user/signup.dto';

interface IProps {}

const SwSignupFormComponent: React.FC<IProps> = () => {
	return (
		<Formik initialValues={{}} onSubmit={handleSignup} validationSchema={getSchemaByType(SignupDto)}>
			{renderForm}
		</Formik>
	);

	async function handleSignup(values) {
		console.log('handleSignup======', values);
	}

	function renderForm(props: FormikProps<any>) {
		return (
			<div className={'ub-mb2'}>
				<Form>
					<SwFormField
						name="username"
						component={Form.Input}
						componentProps={{
							label: 'Username',
							type: 'text',
							placeholder: 'Username',
						}}
					/>

					<SwPasswordField
						name="password"
						componentProps={{
							label: 'Password',
							placeholder: 'Your password',
						}}
					/>

					<SwFormField
						name="confirmPassword"
						component={Form.Input}
						componentProps={{
							label: 'Confirm Password',
							type: 'password',
							placeholder: 'Confirm Your password',
						}}
					/>

					<button className="ui primary button" disabled={!props.isValid} onClick={props.submitForm}>
						Signup
					</button>
				</Form>
			</div>
		);
	}
};
export const SwSignupForm = SwSignupFormComponent;
