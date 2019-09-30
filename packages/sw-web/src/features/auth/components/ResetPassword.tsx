import React, { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { Formik, FormikProps } from 'formik';
import { Divider, Form, Header, Image, Segment } from 'semantic-ui-react';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { ContainerContext } from '@web/shared/lib/store';
import { AuthService } from '@web/features/auth/services/auth.service';
import { SwPasswordField } from '@web/shared/lib/form/components/PasswordField';
import { getSchemaByType } from 'yup-decorator';
import { ResetPasswordDto } from '@shared/lib/dtos/user/reset-password-dto';
import { UserDto } from '@shared/lib/dtos/user/user.dto';
import styled from 'styled-components';
import { redirect } from '@web/shared/lib/navigation/helper';
import { success } from 'react-notification-system-redux';

interface IProps {
	user: UserDto;
	token: string;
}
const SwResetPasswordComponent: React.FC<IProps> = ({ user, token }) => {
	const { store } = useContext(ReactReduxContext);
	const container = useContext(ContainerContext);
	const MarginDivider = styled(Divider)`
		&&& {
			margin-left: var(--space-4);
			margin-right: var(--space-4);
		}
	`;

	return (
		<Segment className={'sw-flex sw-flex-column'}>
			<Image className={'sw-align-self-center'} circular size={'tiny'} src={require('@web/static/logo.svg')} />
			<Header as={'h3'} className={'sw-align-self-center'}>
				Hello {user.firstName}
			</Header>
			<span className={'sw-center sw-mt2'}>Please enter your new password</span>
			<MarginDivider />
			<Formik initialValues={{}} onSubmit={resetPassword} validationSchema={getSchemaByType(ResetPasswordDto)}>
				{renderForm}
			</Formik>
		</Segment>
	);

	async function resetPassword(values) {
		const authService = container.get(AuthService);
		await authService
			.resetPassword({
				userId: user.id,
				resetPasswordDto: values,
				token,
			})
			.toPromise();
		store.dispatch(
			success({
				title: 'Success',
				message: 'Your password has been reset',
			})
		);
		setTimeout(async () => {
			await redirect({
				refresh: true,
				route: 'home',
			});
		}, 2000);
	}

	function renderForm(props: FormikProps<any>) {
		return (
			<div className={'sw-px3'}>
				<Form onSubmit={props.handleSubmit}>
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
						Reset password
					</Form.Button>
				</Form>
			</div>
		);
	}
};
export const SwResetPassword = SwResetPasswordComponent;
