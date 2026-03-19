import { useState } from 'react';
import { MediaLightBox } from './MediaLightBox';

import './MediaPreviewStrip.css';

export function MediaPreviewStrip({ media, onDelete }) {
    const [lightbox, setLightbox] = useState(null);

    if (!media || media.length === 0) return null;

    return (
        <>
            <div className="media-preview-strip">
                {media.map((item, i) => (
                    <div
                        key={i}
                        className="media-preview-thumb"
                        onClick={() => setLightbox(item)}
                    >
                        {item.isVideo ? (
                            <video src={item.url} className="media-thumb" preload="metadata" />
                        ) : (
                            <img src={item.url} alt={`media-${i}`} className="media-thumb" />
                        )}
                        <div className="media-preview-overlay">
                            <span>{item.isVideo ? "▶" : ""}</span>
                        </div>
                        {onDelete && (
                            <button
                                className="media-delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(i);
                                }}
                            >
                                &times;
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {lightbox && (
                <MediaLightBox lightbox={lightbox} setLightbox={setLightbox} />
            )}
        </>
    );
}