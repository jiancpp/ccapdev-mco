import { useState } from 'react';
import imageCompression from 'browser-image-compression';

const compressFile = async (file) => {
    if (file.type.startsWith('image/')) {
        return await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        });
    }
    return file;
};

export const uploadToCloudinary = async (file) => {
    const compressed = await compressFile(file);
    const formData = new FormData();
    formData.append('file', compressed);
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
    const [cropImageSrc, setCropImageSrc] = useState(null); // 👈 crop state

    const handleMediaUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const isVideo = file.type.startsWith('video/');

        // 👇 For single image uploads (avatar), open crop modal instead
        if (!multiple && !isVideo) {
            const reader = new FileReader();
            reader.onload = () => setCropImageSrc(reader.result);
            reader.readAsDataURL(file);
            e.target.value = "";
            return;
        }

        try {
            setUploading(true);
            const url = await uploadToCloudinary(file);
            if (multiple) {
                setMediaAttachments(prev => [{ url, isVideo }, ...prev]);
            } else {
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

    // 👇 Called by CropModal after cropping
    const handleCropDone = async (blob) => {
        setCropImageSrc(null);
        try {
            setUploading(true);
            const url = await uploadToCloudinary(blob);
            setMediaAttachments({ url, isVideo: false });
        } catch (err) {
            console.error("Media upload failed:", err);
            alert("Media upload failed: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleCropCancel = () => setCropImageSrc(null);

    const deleteMedia = (i) => {
        if (multiple) {
            setMediaAttachments(prev => prev.filter((_, idx) => idx !== i));
        } else {
            setMediaAttachments(null);
        }
    };

    const resetMedia = () => setMediaAttachments(multiple ? [] : null);
    const setMedia = (media) => setMediaAttachments(media);

    return {
        mediaAttachments, uploading, handleMediaUpload,
        deleteMedia, resetMedia, setMedia,
        cropImageSrc, handleCropDone, handleCropCancel // 👈 expose crop
    };
}