import { Router } from 'express';
import { login, signup } from '@web/api/auth/auth.controller';

export const authRoute = Router();

authRoute.post('/login', login);
authRoute.post('/signup', signup);
