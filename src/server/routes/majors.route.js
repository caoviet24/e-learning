import express from 'express';
import majorController from '../controllers/major.controller.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/get-all', majorController.getAll);
router.get('/get-by-id/:id', majorController.getById);
router.post('/create', protect, restrictTo('ADMIN'), majorController.create);
router.put('/update/:id', protect, restrictTo('ADMIN'), majorController.update);
router.delete('/delete/:id', protect, restrictTo('ADMIN'), majorController.delete);
router.delete('/delete-soft/:id', protect, restrictTo('ADMIN'), majorController.deleteSoft);
router.put('/restore/:id', protect, restrictTo('ADMIN'), majorController.restore);

export default router;