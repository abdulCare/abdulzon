import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { createOrder, getOrderById, getOrders } from '../controllers/orderController.js';

const router = Router();

router.use(authRequired);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

export default router;
