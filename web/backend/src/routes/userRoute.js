import express from 'express';
import { getUser, updateUser } from '../controllers/userController.js';
import { checkToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/:id', checkToken, getUser);
router.put('/:id', checkToken, updateUser);

export default router; 