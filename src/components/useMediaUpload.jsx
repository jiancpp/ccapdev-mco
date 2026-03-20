import { useState } from 'react';

const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my_review_preset');

    const response = await fetch('https://api.cloudinary.com/v1_1/dnldcpojq/auto/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error('Cloudinary upload failed');

    const data = await response.json();
    return data.secure_url;
};

export function useMediaUpload(initialMedia = [], { multiple = true } = {}) {
    const [mediaAttachments, setMediaAttachments] = useState(initialMedia);
    const [uploading, setUploading] = useState(false);

    const handleMediaUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const isVideo = file.type.startsWith('video/');

        try {
            setUploading(true);
            const url = await uploadToCloudinary(file);

            if (multiple) {
                // Append to array
                setMediaAttachments(prev => [{ url, isVideo }, ...prev]);
            } else {
                // Replace single value
                setMediaAttachments({ url, isVideo });
            }
        } catch (err) {
            console.error("Media upload failed:", err);
            alert("Media upload failed: " + err.message);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const deleteMedia = (i) => {
        if (multiple) {
            setMediaAttachments(prev => prev.filter((_, idx) => idx !== i));
        } else {
            setMediaAttachments(null);
        }
    };

    const resetMedia = () => setMediaAttachments(multiple ? [] : null);

    const setMedia = (media) => setMediaAttachments(media);

    return { mediaAttachments, uploading, handleMediaUpload, deleteMedia, resetMedia, setMedia };
}