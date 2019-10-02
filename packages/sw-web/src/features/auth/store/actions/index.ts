import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';
import {
	LOGIN,
	LOGIN_SUCCESS,
	LOGOUT,
	LOGOUT_SUCCESS,
	RESEND_VERIFICATION_EMAIL,
	RESEND_VERIFICATION_EMAIL_SUCCESS,
	SET_AUTH,
	SIGNUP,
	SIGNUP_SUCCESS,
} from '@web/features/auth/store/actions/actions.constants';
import { CreateUserDto } from '@shared/lib/dtos/user/create-user.dto';
import { LoginDto } from '@shared/lib/dtos/user/login.dto';
import { IAuthState } from '@web/features/auth/store/reducers';

export const logout = createSwStandardAction(LOGOUT)();
export const logoutSuccess = createSwStandardAction(LOGOUT_SUCCESS)();

export const setAuth = createSwStandardAction(SET_AUTH)<IAuthState>();

export const login = (loginDto: LoginDto) => ({ type: LOGIN, payload: loginDto });
export const loginSuccess = () => ({ type: LOGIN_SUCCESS });

export const signup = (userDto: CreateUserDto) => ({ type: SIGNUP, payload: userDto });
export const signupSuccess = () => ({ type: SIGNUP_SUCCESS });

export const resendVerificationEmail = (email: string) => ({ type: RESEND_VERIFICATION_EMAIL, payload: email });
export const resendVerificationEmailSuccess = () => ({ type: RESEND_VERIFICATION_EMAIL_SUCCESS });
