import React from 'react';
import { Form, Header, Image } from 'semantic-ui-react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { SwFormField } from '@web/shared/lib/form/components/FormField';
import { SwPasswordField } from '@web/shared/lib/form/components/PasswordField';
import { UserGender } from '@shared/lib/dtos/user/enum/user-gender.enum';
import { SwCalendarDateField } from '@web/shared/lib/form/components/date/CalendarDateField';
import { UserDto } from '@shared/lib/dtos/user/user.dto';
import { getSchemaByType } from 'yup-decorator';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { modifySchema } from '@web/shared/lib/form/validation/yup';
import { gravatar } from '@web/shared/lib/images/links';

interface IProps {
	user: UserDto;
	didSaveProfile: (user: CreateUserDto) => void;
}
let schema: any = getSchemaByType(CreateUserDto);

schema = modifySchema(schema, {
	password: (passwordSchema: yup.StringSchema) => passwordSchema.notRequired(),
});

const SwBasicProfileComponent: React.FC<IProps> = ({ user, didSaveProfile }) => {
	return (
		<Formik
			initialValues={{ ...user, gender: user.gender || UserGender.MALE } as any}
			enableReinitialize={true}
			validationSchema={schema}
			onSubmit={saveProfile}
			render={props => {
				return (
					<>
						<div className={'sw-flex sw-flex-center sw-mb4'}>
							<Image src={user.profileUrl || gravatar(user.email)} size={'small'} circular />
							<span className={'sw-ml4'}>
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
								<SwCalendarDateField
									name={'dob'}
									placeholder={'Your birthday'}
									label={'Date of Birth'}
									maxDate={new Date()}
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

	function saveProfile(data) {
		const savedData = Object.assign({}, data);
		if (savedData.password === '') {
			delete savedData.password;
		}
		if (savedData.dob === '') {
			savedData.dob = null;
		}

		didSaveProfile(savedData);
	}
};
export const SwBasicProfile = SwBasicProfileComponent;
