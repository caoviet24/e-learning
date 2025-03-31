import express from 'express';
import facultyController from '../controllers/faculty.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/get-all', facultyController.getAll);
router.get('/get-by-id/:id', facultyController.getById);
router.post('/create', protect, restrictTo('ADMIN'), facultyController.create);
router.put('/update/:id', protect, restrictTo('ADMIN'), facultyController.update);
router.delete('/delete/:id', protect, restrictTo('ADMIN'), facultyController.delete);
router.delete('/delete-soft/:id', protect, restrictTo('ADMIN'), facultyController.deleteSoft);
router.put('/restore/:id', protect, restrictTo('ADMIN'), facultyController.restore);

export default router;