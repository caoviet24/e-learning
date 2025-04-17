import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Label } from './ui/label';
import Spinner from './spinner';

interface ImageUploadProps {
    id?: string;
    onChange: (file: File | null) => void;
    value?: string | null;
    className?: string;
    label?: string;
    initialPreview?: string;
}

export const ImageUpload = ({ id = 'file-upload', onChange, value, className, label = 'Hình ảnh', initialPreview }: ImageUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(initialPreview || value || null);
    const [isDragging, setIsDragging] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            onChange(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0] || null;
        if (file) {
            onChange(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPreview(null);
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleClickUpload = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <div className={cn('space-y-2', className)}>
            <Label htmlFor={id}>{label}</Label>
            <input id={id} name={id} type="file" ref={inputRef} className="hidden" accept="image/*" onChange={handleChange} />

            {!preview ? (
                <div
                    className={cn(
                        'flex items-center justify-center w-full border-2 border-dashed rounded-lg transition-colors duration-200 cursor-pointer',
                        isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50/80',
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleClickUpload}
                >
                    <div className="flex flex-col items-center justify-center py-6 px-4">
                        <div className="p-3 rounded-full bg-gray-100 mb-2">
                            <Upload className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="mb-1 text-sm font-medium text-gray-700">
                            <span className="text-primary">Nhấp để tải lên</span> hoặc kéo và thả
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX: 10MB)</p>
                    </div>
                </div>
            ) : (
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                    <div className="group relative">
                        <div className="aspect-video w-full bg-gray-50">
                            <Image src={preview} alt="Image preview" fill sizes="(max-width: 768px) 100vw, 400px" className={` object-contain ${!value && 'blur-sm'}` } />
                            { !value && <Spinner size='sm' />}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                            <Button type="button" variant="secondary" size="sm" onClick={handleClickUpload}>
                                <Upload className="h-4 w-4 mr-1" /> Thay đổi
                            </Button>
                            <Button type="button" variant="destructive" size="sm" onClick={handleRemoveImage}>
                                <X className="h-4 w-4 mr-1" /> Xóa
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
