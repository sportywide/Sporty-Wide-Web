import React, { useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { Form, Header, Segment, Icon } from 'semantic-ui-react';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { getSchemaByType } from 'yup-decorator';
import { validateExists } from '@web/shared/lib/form/validation/validators';
import * as yup from 'yup';

const validateEmail = validateExists({ table: 'user', field: 'email' });

const schema = yup.object().shape({
	email: yup.string().email('Not a valid email'),
});

interface IProps {
	onResend: (email: string) => void;
}

const SwConfirmEmailComponent: React.FC<IProps> = props => {
	const [isFormHidden, setIsFormHidden] = useState(true);

	const handleResend = values => {
		props.onResend(values.email);
	};

	const showForm = e => {
		e.preventDefault();
		setIsFormHidden(false);
	};

	return (
		<Segment className={'ub-flex ub-flex-column'}>
			<Header as={'h3'} className={'ub-align-self-center'} icon>
				We've Sent You a Confirmation Email
				<Icon name="mail" />
				<Header.Subheader>Click the link in your email to confirm your account.</Header.Subheader>
				<Header.Subheader>
					If you can't find the email, check your spam folder or click the link below to resend.
				</Header.Subheader>
			</Header>
			{isFormHidden && (
				<a style={{ cursor: 'pointer' }} className={'ub-align-self-center'} onClick={showForm}>
					Resend verfication email
				</a>
			)}
			{!isFormHidden && (
				<Formik initialValues={{}} onSubmit={handleResend} validationSchema={getSchemaByType(schema)}>
					{renderForm}
				</Formik>
			)}
		</Segment>
	);

	function renderForm(props: FormikProps<any>) {
		return (
			<Form className={'ub-mt3'} onSubmit={props.handleSubmit}>
				<SwFormField
					name="email"
					component={Form.Input}
					componentProps={{
						autoFocus: true,
						label: 'Email',
						type: 'email',
						placeholder: 'Your email',
					}}
					validate={validateEmail}
				/>

				<Form.Button type={'submit'} primary disabled={!props.isValid}>
					Send
				</Form.Button>
			</Form>
		);
	}
};
export const SwConfirmEmail = SwConfirmEmailComponent;
