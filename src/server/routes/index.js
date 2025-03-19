import express from 'express';
import authRoute from './auth.js';
import usersRoute from './users.js';
import coursesRoute from './courses.js';
import youtubeRoute from './youtube.js';
import videosRoute from './videos.js';

const router = express.Router();

router.use('/api/auth', authRoute);
router.use('/api/users', usersRoute);
router.use('/api/courses', coursesRoute);
router.use('/api/youtube', youtubeRoute);
router.use('/api/videos', videosRoute);

export default function AppRoute(app) {
    app.use(router);
}
