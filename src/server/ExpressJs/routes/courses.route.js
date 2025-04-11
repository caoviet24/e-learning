import express from 'express';
import courseController from '../controllers/course.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/get-all', protect, courseController.getAll);
router.get('/get-by-lecturer-id/:id', protect, restrictTo('LECTURER'), courseController.getByLecturerId);
router.get('/get-by-id/:id', protect, courseController.getById);
router.post('/create', protect, restrictTo('LECTURER'), courseController.create);
router.put('/update/:id', protect, restrictTo('LECTURER'), courseController.update);
router.delete('/delete/:id', protect, restrictTo('LECTURER'), courseController.delete);
router.delete('/delete-soft/:id', protect, restrictTo('LECTURER'), courseController.deleteSoft);
router.put('/restore/:id', protect, restrictTo('LECTURER'), courseController.restore);

export default router;
