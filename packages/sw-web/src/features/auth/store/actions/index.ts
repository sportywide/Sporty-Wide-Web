import { LOGOUT, LOGOUT_SUCCESS } from '@web/features/auth/store/actions/actions.constants';

export const logout = () => ({ type: LOGOUT });
export const logoutSuccess = () => ({ type: LOGOUT_SUCCESS });
