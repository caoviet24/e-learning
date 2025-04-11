import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X, Camera, Loader2 } from 'lucide-react';
import { uploadService } from '@/services/uploadService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarChangeDialogProps {
    open: boolean;
    oldAvatar: string;
    onChangeAvatar: (url: string) => void;
    onOpenChange?: (open: boolean) => void;
}

export default function AvatarChangeDialog({
    open,
    oldAvatar,
    onChangeAvatar,
    onOpenChange
}: AvatarChangeDialogProps) {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [newAvatar, setNewAvatar] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setAvatarPreview(null);
            setNewAvatar(null);
            setIsUploading(false);
        }
    }, [open]);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                setAvatarPreview(URL.createObjectURL(file));
                setIsUploading(true);
                const url = await uploadService.uploadImage(file);
                if (url) {
                    setNewAvatar(url);
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSave = () => {
        if (newAvatar) {
            onChangeAvatar(newAvatar);
            onOpenChange?.(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-4">
                <DialogHeader>
                    <DialogTitle className="text-xl">Cập nhật ảnh đại diện</DialogTitle>
                    <DialogDescription>
                        Tải lên một ảnh mới cho hồ sơ giảng viên của bạn
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            {/* Show preview or uploaded image, fallback to old avatar */}
                            <Avatar className="h-40 w-40 border-4 border-primary/10">
                                <AvatarImage
                                    src={avatarPreview || newAvatar || oldAvatar}
                                    alt="Avatar preview"
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-primary/10 text-xl">
                                    {isUploading ? <Loader2 className="h-10 w-10 animate-spin" /> : <Upload className="h-10 w-10" />}
                                </AvatarFallback>
                            </Avatar>
                            
    
                            <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="absolute bottom-1 right-1 rounded-full shadow-lg"
                                onClick={triggerFileInput}
                                disabled={isUploading}
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                            
                            {/* Reset button shows only when we have a preview or new avatar */}
                            {(avatarPreview || newAvatar) && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 rounded-full shadow-lg h-8 w-8 opacity-80"
                                    onClick={() => {
                                        setAvatarPreview(null);
                                        setNewAvatar(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        
                        {isUploading && (
                            <p className="text-sm text-muted-foreground animate-pulse">
                                Đang tải lên...
                            </p>
                        )}
                        
                        <p className="text-sm text-center text-muted-foreground">
                            Tải lên một hình ảnh cho hồ sơ của bạn. Hình ảnh nên có kích thước vuông để hiển thị tốt nhất.
                        </p>
                        
                        <input
                            ref={fileInputRef}
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </div>
                </div>
                <DialogFooter className="flex flex-row justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange?.(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        disabled={!newAvatar || isUploading}
                        onClick={handleSave}
                    >
                        {isUploading ? 'Đang tải lên...' : 'Lưu thay đổi'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
