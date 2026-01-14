import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import userController from './user.controller';

const router = Router();

router.use(authenticate);

router.post('/', authorize('OWNER', 'MANAGER'), userController.createUser);
router.get('/', authorize('OWNER', 'MANAGER'), userController.getUsers);
router.get('/:id', authorize('OWNER', 'MANAGER'), userController.getUserById);
router.patch('/:id', authorize('OWNER', 'MANAGER'), userController.updateUser);
router.delete('/:id', authorize('OWNER'), userController.deleteUser);

export default router;
