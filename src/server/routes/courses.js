import express from 'express';
const courseController = require('../controllers/courseController');
const videoController = require('../controllers/videoController');
import { protect } from '../middleware/auth';

const router = express.Router();

// Course routes
router.post('/', protect, courseController.createCourse);
router.put('/:id', protect, courseController.updateCourse);
router.delete('/:id', protect, courseController.deleteCourse);
router.get('/:id', courseController.getCourse);
router.get('/', courseController.getAllCourses);

// Video routes under courses
router.post('/:courseId/videos',protect, courseController.addVideo);
router.get('/:courseId/videos', courseController.getCourseVideos);
router.put('/:courseId/videos/:id', protect, videoController.updateVideo);
router.delete('/:courseId/videos/:id', protect, videoController.deleteVideo);
router.get('/:courseId/videos/:id', videoController.getVideo);
router.patch('/:courseId/videos/:id/reorder', protect, videoController.reorderVideo);

export default router;