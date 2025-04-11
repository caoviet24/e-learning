async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch('/api/uploads', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await res.json();
        return data.url;
    } catch (error) {
        console.log('Upload failed:', error);
        return null;
    }
}

export const uploadService = {
    uploadImage,
};
