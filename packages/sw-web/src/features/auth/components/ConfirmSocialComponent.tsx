import React from 'react';
import { Formik, FormikProps } from 'formik';
import { Form, Header, Image, Segment } from 'semantic-ui-react';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { getSchemaByType } from 'yup-decorator';
import { CompleteSocialProfileDto } from '@shared/lib/dtos/user/complete-social-profile.dto';
import { SwPasswordField } from '@web/shared/lib/form/components/PasswordField';

const SwConfirmSocialComponent: React.FC<any> = () => {
	return (
		<Segment className={'ub-flex ub-flex-column'}>
			<Image className={'ub-align-self-center'} circular size={'tiny'} src={require('@web/static/logo.svg')} />
			<Header as={'h3'} className={'ub-align-self-center'}>
				Complete your profile
			</Header>
			<Formik
				initialValues={{}}
				onSubmit={console.info}
				validationSchema={getSchemaByType(CompleteSocialProfileDto)}
			>
				{renderForm}
			</Formik>
		</Segment>
	);
};

function renderForm(props: FormikProps<any>) {
	return (
		<Form className={'ub-mt3'}>
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
			<Form.Button primary disabled={!props.isValid}>
				Save
			</Form.Button>
		</Form>
	);
}
export const SwConfirmSocial = SwConfirmSocialComponent;
