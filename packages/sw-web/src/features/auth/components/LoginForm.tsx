import React from 'react';
import { Formik, FormikProps } from 'formik';
import { Form } from 'semantic-ui-react';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { getSchemaByType } from 'yup-decorator';
import { LoginDto } from '@shared/lib/dtos/user/login.dto';
import { Link } from '@web/routes';

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

					<SwFormField
						name="password"
						component={Form.Input}
						componentProps={{
							label: 'Password',
							type: 'password',
							placeholder: 'Your password',
						}}
					/>
					<Link route={'forgot-password'}>
						<a className="ub-flex ub-flex-column ub-mb2 ub-right">Forgot your password?</a>
					</Link>

					<button className="ui primary button" disabled={!props.isValid} onClick={props.submitForm}>
						Login
					</button>
				</Form>
			</div>
		);
	}
};
export const SwLoginForm = SwLoginFormComponent;
