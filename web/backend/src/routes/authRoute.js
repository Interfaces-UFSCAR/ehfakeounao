import express from 'express';
import { registerUser, loginUser, requestResetPassword, resetPassword, emailVerification } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/requestResetPassword', requestResetPassword);
router.post('/resetPassword', resetPassword);
router.post('/verifyEmail', emailVerification);

export default router;