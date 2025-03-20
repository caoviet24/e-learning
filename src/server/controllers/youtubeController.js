import fs from 'fs';
import youtubeService from '../services/youtubeService.js';

export const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Video file is required' });
        }

        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        // Upload video to YouTube
        const result = await youtubeService.uploadVideo(req.file.path, title, description);

        res.json(result);
    } catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({ message: 'Error uploading video to YouTube' });
    } finally {
        // Clean up the temporary file
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting temp file:', err);
            });
        }
    }
};

export const getVideoInfo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const videoInfo = await youtubeService.getVideoInfo(videoId);
        res.json(videoInfo);
    } catch (error) {
        console.error('Get video info error:', error);
        res.status(500).json({ message: 'Error getting video information' });
    }
};

export const updateVideoInfo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { title, description } = req.body;

        if (!title && !description) {
            return res.status(400).json({ message: 'Title or description is required' });
        }

        const result = await youtubeService.updateVideoInfo(videoId, title, description);
        res.json(result);
    } catch (error) {
        console.error('Update video info error:', error);
        res.status(500).json({ message: 'Error updating video information' });
    }
};

