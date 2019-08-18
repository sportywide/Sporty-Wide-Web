import { Router } from 'express';
import { logout } from '@web/api/auth/controller';

export const authRouter = Router();

authRouter.post('/logout', logout);
