import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import classController from '../controllers/class.controller.js';

const router = express.Router();

router.get('/get-all', classController.getAll);
// router.post('/create', protect, restrictTo('ADMIN'), facultyController.create);
// router.put('/update/:id', protect, restrictTo('ADMIN'), facultyController.update);
// router.delete('/delete/:id', protect, restrictTo('ADMIN'), facultyController.delete);
// router.delete('/delete-soft/:id', protect, restrictTo('ADMIN'), facultyController.deleteSoft);
// router.put('/restore/:id', protect, restrictTo('ADMIN'), facultyController.restore);

export default router;