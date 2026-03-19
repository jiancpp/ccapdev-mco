import './MediaLightBox.css';

export function MediaLightBox({ lightbox, setLightbox }) {
    return (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <button className="lightbox-close" onClick={() => setLightbox(null)}>&times;</button>
                {lightbox.isVideo ? (
                    <video src={lightbox.url} controls autoPlay preload="metadata" className="lightbox-media" />
                ) : (
                    <img src={lightbox.url} alt="preview" className="lightbox-media" />
                )}
            </div>
        </div>
    )
}