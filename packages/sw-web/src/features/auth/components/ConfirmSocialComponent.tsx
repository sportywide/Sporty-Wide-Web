import React from 'react';
import { Formik, FormikProps } from 'formik';
import { Segment, Form, Image, Header } from 'semantic-ui-react';
import { SwFormField } from '@web/shared/lib/form/components/FormField';

const SwConfirmSocialComponent: React.FC<any> = () => {
	return (
		<Segment className={'ub-flex ub-flex-column'}>
			<Image className={'ub-align-self-center'} circular size={'tiny'} src={require('@web/static/logo.svg')} />
			<Header as={'h3'} className={'ub-align-self-center'}>
				Complete your profile
			</Header>
			<Formik initialValues={{}} onSubmit={console.info} render={renderForm} />
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

			<SwFormField
				name="password"
				component={Form.Input}
				componentProps={{
					label: 'Password',
					type: 'password',
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
