import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { getLikes, likeProduct, unlikeProduct } from '../controllers/likeController.js';

const router = Router();

router.use(authRequired);
router.get('/', getLikes);
router.post('/:productId', likeProduct);
router.delete('/:productId', unlikeProduct);

export default router;
