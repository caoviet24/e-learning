import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
  size: string;
  status: string;
  course_id: string;
  order: number;
}

export interface UploadVideoDTO {
  title: string;
  file: File;
  course_id: string;
}

export const videoService = {
  async uploadVideo(data: UploadVideoDTO) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('file', data.file);
    formData.append('course_id', data.course_id);

    const response = await axios.post(`${API_URL}/api/videos/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getVideos(courseId: string, page = 1, limit = 10) {
    const response = await axios.get(
      `${API_URL}/api/courses/${courseId}/videos?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  async deleteVideo(videoId: string) {
    const response = await axios.delete(`${API_URL}/api/videos/${videoId}`);
    return response.data;
  },

  async updateVideo(videoId: string, data: Partial<Video>) {
    const response = await axios.patch(`${API_URL}/api/videos/${videoId}`, data);
    return response.data;
  },
};