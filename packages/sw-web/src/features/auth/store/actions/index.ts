import { LOGOUT, LOGOUT_SUCCESS, LOGIN, LOGIN_SUCCESS, SIGNUP, SIGNUP_SUCCESS } from '@web/features/auth/store/actions/actions.constants';

export const logout = () => ({ type: LOGOUT });
export const logoutSuccess = () => ({ type: LOGOUT_SUCCESS });

export const login = () => ({ type: LOGIN });
export const loginSuccess = () => ({ type: LOGIN_SUCCESS });

export const signup = () => ({ type: SIGNUP });
export const signupSuccess = () => ({ type: SIGNUP_SUCCESS });
