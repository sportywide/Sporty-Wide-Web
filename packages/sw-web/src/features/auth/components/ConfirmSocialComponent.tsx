import React, { useContext } from 'react';
import { Formik, FormikProps } from 'formik';
import { Form, Header, Image, Segment } from 'semantic-ui-react';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { getSchemaByType } from 'yup-decorator';
import { CompleteSocialProfileDto } from '@shared/lib/dtos/user/complete-social-profile.dto';
import { SwPasswordField } from '@web/shared/lib/form/components/PasswordField';
import { ContainerContext } from '@web/shared/lib/store';
import { AuthService } from '@web/features/auth/services/auth.service';

const SwConfirmSocialComponent: React.FC<any> = () => {
	const container = useContext(ContainerContext);
	return (
		<Segment className={'ub-flex ub-flex-column'}>
			<Image className={'ub-align-self-center'} circular size={'tiny'} src={require('@web/static/logo.svg')} />
			<Header as={'h3'} className={'ub-align-self-center'}>
				Complete your profiles
			</Header>
			<Formik
				initialValues={{}}
				onSubmit={confirmSocialProfile}
				validationSchema={getSchemaByType(CompleteSocialProfileDto)}
			>
				{renderForm}
			</Formik>
		</Segment>
	);

	async function confirmSocialProfile(values) {
		const authService = container.get(AuthService);
		await authService.confirmSocial(values).toPromise();
		window.location.replace('/');
	}
};

function renderForm(props: FormikProps<any>) {
	return (
		<Form className={'ub-mt3'} onSubmit={props.handleSubmit}>
			<SwFormField
				name="username"
				component={Form.Input}
				componentProps={{
					label: 'Username',
					placeholder: 'Your username',
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
			<Form.Button type={'submit'} primary disabled={!props.isValid}>
				Save
			</Form.Button>
		</Form>
	);
}
export const SwConfirmSocial = SwConfirmSocialComponent;
