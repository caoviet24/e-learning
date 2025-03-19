'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Upload, Video, X } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Select, SelectContent, SelectTrigger, SelectGroup, SelectItem, SelectLabel } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { videoService } from '@/services/videoService';
import { toast } from 'sonner';

export default function CourseVideosPage() {
    const { id } = useParams();
    const [title, setTitle] = React.useState('');
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const queryClient = useQueryClient();

    // Fetch videos
    const { data: videosData, isLoading } = useQuery({
        queryKey: ['videos', id],
        queryFn: () => videoService.getVideos(id as string),
    });

    // Upload video mutation
    const uploadMutation = useMutation({
        mutationFn: (data: { title: string; file: File; course_id: string }) =>
            videoService.uploadVideo(data),
        onSuccess: () => {
            toast.success('Video uploaded successfully');
            setTitle('');
            setSelectedFile(null);
            queryClient.invalidateQueries({ queryKey: ['videos', id] });
        },
        onError: (error) => {
            toast.error('Failed to upload video');
            console.error('Upload error:', error);
        },
    });

    // Delete video mutation
    const deleteMutation = useMutation({
        mutationFn: (videoId: string) => videoService.deleteVideo(videoId),
        onSuccess: () => {
            toast.success('Video deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['videos', id] });
        },
        onError: (error) => {
            toast.error('Failed to delete video');
            console.error('Delete error:', error);
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = () => {
        if (!selectedFile || !title) {
            toast.error('Please provide both title and video file');
            return;
        }

        uploadMutation.mutate({
            title,
            file: selectedFile,
            course_id: id as string,
        });
    };

    const handleDelete = (videoId: string) => {
        if (confirm('Are you sure you want to delete this video?')) {
            deleteMutation.mutate(videoId);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href={`/lecturer/courses/${id}`}>
                    <Button variant="ghost">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại khóa học
                    </Button>
                </Link>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Upload Video Bài Giảng</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Tiêu đề video</Label>
                            <Input
                                id="title"
                                placeholder="Nhập tiêu đề video"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div>
                                <Label htmlFor="video">File video</Label>
                            </div>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                <Input
                                    id="video"
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="video" className="cursor-pointer flex flex-col items-center gap-2">
                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {selectedFile ? selectedFile.name : 'Kéo thả file vào đây hoặc click để chọn file'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">MP4, WebM hoặc Ogg (Tối đa 500MB)</p>
                                </label>
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleUpload}
                            disabled={uploadMutation.isPending}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadMutation.isPending ? 'Đang tải lên...' : 'Upload Video'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Danh sách video ({isLoading ? '...' : videosData?.videos.length || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {isLoading ? (
                            <div>Đang tải...</div>
                        ) : videosData?.videos.map((video: any) => (
                            <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <Video className="w-8 h-8 text-muted-foreground" />
                                    <div>
                                        <h4 className="font-medium">{video.title}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {video.duration} • {video.size} • {video.status}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(video.id)}
                                    disabled={deleteMutation.isPending}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
