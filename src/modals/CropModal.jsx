import { useState, useCallback } from 'react';

import Cropper from 'react-easy-crop';
import './CropModal.css';

const createCroppedImage = async (imageSrc, croppedAreaPixels) => {
    const image = await createImageBitmap(await fetch(imageSrc).then(r => r.blob()));
    const canvas = document.createElement('canvas');
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
        image,
        croppedAreaPixels.x, croppedAreaPixels.y,
        croppedAreaPixels.width, croppedAreaPixels.height,
        0, 0,
        croppedAreaPixels.width, croppedAreaPixels.height
    );
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
};

function CropModal({ imageSrc, onCancel, onCropDone }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleDone = async () => {
        const blob = await createCroppedImage(imageSrc, croppedAreaPixels);
        onCropDone(blob);
    };

    return (
        <div className="crop-modal">
            <div className="crop-container">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>
            <div className="crop-controls">
                <input
                    type="range" min={1} max={3} step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                />
                <button onClick={onCancel}>Cancel</button>
                <button onClick={handleDone}>Crop & Upload</button>
            </div>
        </div>
    );
}

export default CropModal;