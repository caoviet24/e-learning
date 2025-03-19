'use client';

import { FileHomework } from "@/content/homework-data";
import { Button } from "@/components/ui/button";
import { FileUp, X, Upload, File } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FileUploadSubmissionProps {
    homework: FileHomework;
}

export function FileUploadSubmission({ homework }: FileUploadSubmissionProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) validateAndSetFile(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) validateAndSetFile(file);
    };

    const validateAndSetFile = (file: File) => {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const isValidType = homework.allowedFileTypes.includes(fileExtension);
        const isValidSize = file.size <= homework.maxFileSize * 1024 * 1024;

        if (!isValidType) {
            alert(`Định dạng file không hợp lệ. Vui lòng chọn file có định dạng: ${homework.allowedFileTypes.join(', ')}`);
            return;
        }

        if (!isValidSize) {
            alert(`File không được vượt quá ${homework.maxFileSize}MB`);
            return;
        }

        setSelectedFile(file);
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;
        // TODO: Implement file upload logic
        console.log('Uploading file:', selectedFile);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* File upload area */}
            <div 
                className={cn(
                    "border-2 border-dashed rounded-lg transition-colors",
                    dragActive 
                        ? "border-primary bg-primary/5" 
                        : "border-muted-foreground/25 hover:border-primary/50",
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {selectedFile ? (
                    // Selected file preview
                    <div className="p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-muted rounded-lg">
                                    <File className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{selectedFile.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedFile(null)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Upload prompt
                    <div className="p-8 text-center">
                        <div className="mb-4">
                            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Upload className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium">
                                Kéo thả file vào đây hoặc
                            </p>
                            <label className="text-primary hover:text-primary/80 cursor-pointer">
                                chọn file từ máy tính
                                <input
                                    type="file"
                                    className="hidden"
                                    accept={homework.allowedFileTypes.join(',')}
                                    onChange={handleFileSelect}
                                />
                            </label>
                            <p className="text-sm text-muted-foreground">
                                Định dạng hỗ trợ: {homework.allowedFileTypes.join(', ')}
                                <br />
                                Dung lượng tối đa: {homework.maxFileSize}MB
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Submit button */}
            <Button
                className="w-full"
                disabled={!selectedFile}
                onClick={handleSubmit}
            >
                <FileUp className="w-4 h-4 mr-2" />
                Nộp bài
            </Button>
        </div>
    );
}