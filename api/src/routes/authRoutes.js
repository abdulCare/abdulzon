import { Router } from 'express';
import { register, login, logout, currentUser } from '../controllers/authController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authRequired, logout);
router.get('/me', authRequired, currentUser);

export default router;
