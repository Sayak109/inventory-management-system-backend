import { Router } from 'express';
import salesOrderController from './sales-order.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', salesOrderController.createOrder);
router.post('/:id/confirm', authorize('OWNER', 'MANAGER'), salesOrderController.confirmOrder);
router.post('/:id/cancel', authorize('OWNER', 'MANAGER'), salesOrderController.cancelOrder);
router.get('/', salesOrderController.getOrders);
router.get('/:id', salesOrderController.getOrderById);

export default router;
