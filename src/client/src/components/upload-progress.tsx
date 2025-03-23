import React, { useEffect, useState } from 'react';
import { useSocket } from '@/providers/SockerProvider';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
    uploadId?: string;
    onComplete?: (videoId: string, url: string) => void;
}

export const UploadProgress = ({ uploadId, onComplete }: UploadProgressProps) => {
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState('');
    const { on, off } = useSocket();

    useEffect(() => {
        if (!uploadId) return;

        const handleProgress = (data: { uploadId: string; progress: number; fileName: string }) => {
            if (data.uploadId === uploadId) {
                setProgress(data.progress);
                setFileName(data.fileName);
            }
        };

        const handleComplete = (data: { uploadId: string; videoId: string; url: string }) => {
            if (data.uploadId === uploadId) {
                setProgress(100);
                onComplete?.(data.videoId, data.url);
            }
        };

        on('upload-progress', handleProgress);
        on('upload-complete', handleComplete);

        return () => {
            off('upload-progress');
            off('upload-complete');
        };
    }, [uploadId, on, off, onComplete]);

    if (!uploadId || progress === 0) return null;

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
                <span>{fileName}</span>
                <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
        </div>
    );
};