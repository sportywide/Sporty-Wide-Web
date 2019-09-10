import React from 'react';
import { Form, Header, Image } from 'semantic-ui-react';
import { Formik } from 'formik';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { SwPasswordField } from '@web/shared/lib/form/components/PasswordField';
import { IUser } from '@web/shared/lib/interfaces/auth/user';
import { UserGender } from '@shared/lib/dtos/user/enum/user-gender.enum';
import { SwCalendarField } from '@web/shared/lib/form/components/CalendarField';

interface IProps {
	user: IUser;
}
const SwBasicProfileComponent: React.FC<IProps> = ({ user }) => {
	console.log(user);
	return (
		<Formik
			initialValues={user}
			enableReinitialize={true}
			onSubmit={console.log}
			render={props => {
				return (
					<>
						<div className={'ub-flex ub-flex-center ub-mb4'}>
							<Image
								src={'https://pickaface.net/gallery/avatar/unr_randomavatar_170412_0236_9n4c2i.png'}
								size={'small'}
								circular
							/>
							<span className={'ub-ml4'}>
								<Header as={'h4'}>{user.username}</Header>
							</span>
						</div>
						<Form onSubmit={props.handleSubmit}>
							<Form.Group widths="equal">
								<SwFormField
									name="gender"
									component={Form.Select}
									componentProps={{
										label: 'Gender',
										options: [
											{ key: 'm', text: 'Male', value: UserGender.MALE },
											{ key: 'f', text: 'Female', value: UserGender.FEMALE },
											{ key: 'o', text: 'Other', value: null },
										],
									}}
								/>
								<SwFormField
									name="firstName"
									component={Form.Input}
									componentProps={{
										label: 'First name',
										placeholder: 'First name',
									}}
								/>

								<SwFormField
									name="lastName"
									component={Form.Input}
									componentProps={{
										label: 'Last name',
										placeholder: 'Last name',
									}}
								/>
							</Form.Group>
							<Form.Group widths={'equal'}>
								<SwFormField
									name="email"
									component={Form.Input}
									componentProps={{
										icon: 'mail',
										label: 'Email',
										placeholder: 'Email',
									}}
								/>
								<SwPasswordField
									name="password"
									className={'field'}
									componentProps={{
										label: 'Password',
										placeholder: 'Password',
									}}
								/>
							</Form.Group>
							<Form.Group widths={2}>
								<SwCalendarField
									name={'dob'}
									componentProps={{
										placeholder: 'Your birthday',
										label: 'Date of Birth',
									}}
								/>
								<SwFormField
									name="phone"
									component={Form.Input}
									componentProps={{
										icon: 'phone',
										label: 'Phone',
										placeholder: 'Your Phone',
									}}
								/>
							</Form.Group>
							<Form.Button type="submit" primary disabled={!props.isValid}>
								Save
							</Form.Button>
						</Form>
					</>
				);
			}}
		/>
	);
};
export const SwBasicProfile = SwBasicProfileComponent;
