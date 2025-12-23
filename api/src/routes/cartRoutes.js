import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { getCart, addCartItem, updateCartItem, removeCartItem } from '../controllers/cartController.js';

const router = Router();

router.use(authRequired);
router.get('/', getCart);
router.post('/items', addCartItem);
router.patch('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeCartItem);

export default router;
