import { Router } from 'express';
import { logout, redirect } from '@web/api/auth/controller';

export const authRouter = Router();
authRouter.post('/logout', logout);
authRouter.get('/redirect', redirect);
