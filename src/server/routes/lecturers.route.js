import express from 'express';
import lecturerController from '../controllers/lecturer.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/get-all', lecturerController.getAll);
router.get('/get-by-id/:id', lecturerController.getById);
router.get('/search-by-department/:faculty_id', lecturerController.searchByDepartment);

// Protected routes - only ADMIN can access
router.post('/create', protect, restrictTo('ADMIN'), lecturerController.create);
router.put('/update/:id', protect, restrictTo('ADMIN'), lecturerController.update);
router.delete('/delete/:id', protect, restrictTo('ADMIN'), lecturerController.delete);
router.delete('/delete-soft/:id', protect, restrictTo('ADMIN'), lecturerController.deleteSoft);
router.put('/restore/:id', protect, restrictTo('ADMIN'), lecturerController.restore);

export default router;