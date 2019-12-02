import React from 'react';
import { Formik, FormikProps } from 'formik';
import { Form } from 'semantic-ui-react';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { getSchemaByType } from 'yup-decorator';
import { LoginDto } from '@shared/lib/dtos/user/login.dto';
import { Link } from '@web/routes';

interface IProps {
	onLogin: (loginDto: LoginDto) => void;
}

const SwLoginFormComponent: React.FC<IProps> = props => {
	const handleLogin = values => {
		props.onLogin(values);
	};

	return (
		<Formik initialValues={{}} onSubmit={handleLogin} validationSchema={getSchemaByType(LoginDto)}>
			{renderForm}
		</Formik>
	);

	function renderForm(props: FormikProps<any>) {
		return (
			<div className={'sw-mb2 sw-p1'}>
				<Form className="ui form" onSubmit={props.handleSubmit}>
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
							<a className="sw-flex sw-flex-column sw-mb2 sw-right">Forgot your password?</a>
						</Link>
					</div>

					<button className="ui primary button" disabled={!props.isValid} type="submit">
						Login
					</button>
				</Form>
			</div>
		);
	}
};
export const SwLoginForm = SwLoginFormComponent;
