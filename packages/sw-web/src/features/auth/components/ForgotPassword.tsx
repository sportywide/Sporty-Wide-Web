import React, { useContext } from 'react';
import { Formik, FormikProps } from 'formik';
import { Form, Header, Image, Segment, Divider } from 'semantic-ui-react';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { ContainerContext } from '@web/shared/lib/store';
import { AuthService } from '@web/features/auth/services/auth.service';
import { validateExists } from '@web/shared/lib/form/validation';
import { redirect } from '@web/shared/lib/navigation/helper';
import * as yup from 'yup';
import styled from 'styled-components';

const validateEmail = validateExists({ table: 'user', field: 'email' });
const schema = yup.object().shape({
	email: yup.string().email('Not a valid email'),
});

const SwForgotPasswordComponent: React.FC<any> = () => {
	const container = useContext(ContainerContext);
	const MarginDivider = styled(Divider)`
		&&& {
			margin-left: var(--space-4);
			margin-right: var(--space-4);
		}
	`;
	return (
		<Segment className={'ub-flex ub-flex-column'}>
			<Image className={'ub-align-self-center'} circular size={'tiny'} src={require('@web/static/logo.svg')} />
			<Header as={'h3'} className={'ub-align-self-center'}>
				Reset your password
			</Header>
			<span className={'ub-center ub-mt2'}>Please enter your email to reset your password</span>
			<MarginDivider />
			<Formik initialValues={{}} onSubmit={sendForgotPasswordEmail} validationSchema={schema}>
				{renderForm}
			</Formik>
		</Segment>
	);

	async function sendForgotPasswordEmail(values) {
		const authService = container.get(AuthService);
		await authService.sendForgotPasswordEmail(values).toPromise();
	}

	function renderForm(props: FormikProps<any>) {
		return (
			<div className={'ub-px3'}>
				<Form className={'ub-mt2'} onSubmit={props.handleSubmit}>
					<SwFormField
						name="email"
						component={Form.Input}
						componentProps={{
							label: 'Email',
							placeholder: 'Your email',
						}}
						validate={validateEmail}
					/>

					<Form.Button type={'submit'} primary disabled={!props.isValid}>
						Send email
					</Form.Button>
				</Form>
			</div>
		);
	}
};
export const SwForgotPassword = SwForgotPasswordComponent;
