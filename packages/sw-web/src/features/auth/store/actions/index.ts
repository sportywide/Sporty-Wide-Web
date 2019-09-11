import {
	LOGOUT,
	LOGOUT_SUCCESS,
	LOGIN,
	LOGIN_SUCCESS,
	SIGNUP,
	SIGNUP_SUCCESS,
	RESEND_VERIFICATION_EMAIL,
	RESEND_VERIFICATION_EMAIL_SUCCESS,
} from '@web/features/auth/store/actions/actions.constants';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { LoginDto } from '@shared/lib/dtos/user/login.dto';

export const logout = () => ({ type: LOGOUT });
export const logoutSuccess = () => ({ type: LOGOUT_SUCCESS });

export const login = (loginDto: LoginDto) => ({ type: LOGIN, payload: loginDto });
export const loginSuccess = () => ({ type: LOGIN_SUCCESS });

export const signup = (userDto: CreateUserDto) => ({ type: SIGNUP, payload: userDto });
export const signupSuccess = () => ({ type: SIGNUP_SUCCESS });

export const resendVerificationEmail = (email: string) => ({ type: RESEND_VERIFICATION_EMAIL, payload: email });
export const resendVerificationEmailSuccess = () => ({ type: RESEND_VERIFICATION_EMAIL_SUCCESS });
