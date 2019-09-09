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

	function renderForm(props: FormikProps<any>) {
		return (
			<div className={'ub-px3'}>
				<Form onSubmit={props.handleSubmit}>
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

					<Form.Button type={'submit'} primary disabled={!props.isValid}>
						Login
					</Form.Button>
				</Form>
			</div>
		);
	}
};
export const SwLoginForm = SwLoginFormComponent;
