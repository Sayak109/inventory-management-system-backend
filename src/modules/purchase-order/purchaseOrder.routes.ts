import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import purchesOrderController from './purchaseOrder.controller';

const router = Router();

router.use(authenticate);
router.post('/', purchesOrderController.createPO);
router.patch('/:id/status', purchesOrderController.updatePOStatus);
router.patch('/:id/receive', purchesOrderController.receivePO);
router.get('/', purchesOrderController.getPOList);
router.get('/:id', purchesOrderController.getPOById);

export default router;