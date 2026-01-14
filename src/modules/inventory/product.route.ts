import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import productController from './product.controller';

const router = Router();
router.use(authenticate);

router.post('/', authorize('OWNER', 'MANAGER'), productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.patch('/:id', authorize('OWNER', 'MANAGER'), productController.updateProduct);
router.patch('/:id/status', authorize('OWNER', 'MANAGER'), productController.updateProductStatus);
router.delete('/:id', authorize('OWNER', 'MANAGER'), productController.deleteProduct);

export default router;
