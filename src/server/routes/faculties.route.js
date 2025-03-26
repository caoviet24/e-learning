import express from 'express';
import departmentController from '../controllers/faculty.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/get-all', departmentController.getAll);
router.get('/get-by-id/:id', departmentController.getById);
router.post('/create', protect, restrictTo('ADMIN'), departmentController.create);
router.put('/update/:id', protect, restrictTo('ADMIN'), departmentController.update);
router.delete('/delete-soft/:id', protect, restrictTo('ADMIN'), departmentController.deleteSoft);

export default router;