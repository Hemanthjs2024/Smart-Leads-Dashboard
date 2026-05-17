import { Router } from 'express';
import { register, login, getMe, changePassword, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../validations/auth.validation';
import { protect } from '../middleware/auth.middleware';

const authRouter = Router();

authRouter.post('/register', registerValidation, register);
authRouter.post('/login', loginValidation, login);
authRouter.get('/me', protect, getMe);
authRouter.post('/change-password', protect, changePassword);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', resetPassword);

export default authRouter;
