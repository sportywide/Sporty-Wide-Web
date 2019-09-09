import React from 'react';
import { Formik, FormikProps } from 'formik';
import { Form } from 'semantic-ui-react';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { SwPasswordField } from '@web/shared/lib/form/components/PasswordField';
import { getSchemaByType } from 'yup-decorator';
import { LoginDto } from '@shared/lib/dtos/user/login-dto';

interface IProps {}

const SwLoginFormComponent: React.FC<IProps> = () => {
	return (
		<Formik initialValues={{}} onSubmit={handleLogin} validationSchema={getSchemaByType(LoginDto)}>
			{renderForm}
		</Formik>
	);

	async function handleLogin(values) {
		console.log('handleLogin======', values);
	}

	function handleSignup() {
		console.log('handleSignup======');
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
						disableProgress={true}
						componentProps={{
							label: 'Password',
							placeholder: 'Your password',
						}}
					/>

					<button className="ui primary button" disabled={!props.isValid} onClick={props.submitForm}>
						Login
					</button>
					<button className="ui button" onClick={handleSignup}>
						Signup
					</button>
				</Form>
			</div>
		);
	}
};
export const SwLoginForm = SwLoginFormComponent;
