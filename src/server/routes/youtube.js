import express from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth.js';
const youtubeController = require('../controllers/youtubeController');

const router = express.Router();

// Configure multer for video upload
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept video files only
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});

// YouTube video management routes
router.post('/upload', auth, upload.single('video'), youtubeController.uploadVideo);
router.get('/videos/:videoId', auth, youtubeController.getVideoInfo);
router.put('/videos/:videoId', auth, youtubeController.updateVideoInfo);

export default router;