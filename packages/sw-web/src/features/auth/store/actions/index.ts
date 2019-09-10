import { LOGOUT, LOGOUT_SUCCESS } from '@web/features/auth/store/actions/actions.constants';
import { createSwStandardAction } from '@web/shared/lib/redux/action-creators';

export const logout = createSwStandardAction(LOGOUT)();
export const logoutSuccess = createSwStandardAction(LOGOUT_SUCCESS)();
