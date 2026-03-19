import {
  RichTextEditorComponent, Toolbar, Link, HtmlEditor, QuickToolbar, Inject
} from '@syncfusion/ej2-react-richtexteditor';
import { InteractiveStarRating } from '../components/StarRating';
import { SearchBar } from '../components/SearchBar';
import { useState, useRef, useEffect } from 'react';
import { createReview, getAllData } from '../api/api';

import './ReviewModal.css';

function ReviewModal({ isOpen, onClose, activeUserID, preSelected, currentRating = null }) {
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [header, setHeader] = useState("");
    const [rating, setRating] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [mediaAttachments, setMediaAttachments] = useState([]);
    const [lightbox, setLightbox] = useState(null); 
    const rteRef = useRef(null);
    const mediaInputRef = useRef(null);

    const toolbarSettings = {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'CreateLink', '|', 'Undo', 'Redo']
    };

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

    const handleMediaUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const isVideo = file.type.startsWith('video/');

        try {
            setUploading(true);
            const url = await uploadToCloudinary(file);

            // Adds new media to the start of the list
            setMediaAttachments(prev => [{ url, isVideo }, ...prev]);

        } catch (err) {
            console.error("Media upload failed:", err);
            alert("Media upload failed: " + err.message);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    // Fetch search data when modal opens, reset state when it closes
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const [sData, albData, artData] = await Promise.all([
                        getAllData('songs'),
                        getAllData('albums'),
                        getAllData('artists')
                    ]);
                    setSongs(sData);
                    setAlbums(albData);
                    setArtists(artData);
                } catch (err) {
                    console.error("Error loading search data:", err);
                }
            };
            fetchData();
        } else {
            setSelectedItem(null);
            setHeader("");
            setRating(0);
            setMediaAttachments([]);
            setLightbox(null);
            if (rteRef.current) rteRef.current.value = "";
        }
    }, [isOpen]);

    // Pre-select item if passed in from parent
    useEffect(() => {
        const { targetID, targetType, title, artistID, cover } = preSelected || {};
        if (targetID && targetType) {
            setSelectedItem({ _id: targetID, title, artistID, cover, type: targetType });
        } else {
            setSelectedItem(null);
        }
    }, [isOpen, preSelected]);

    const handleSelect = (item) => {
        const isAlbum = !!item.albumName;
        setSelectedItem({
            _id: item._id,
            title: isAlbum ? item.albumName : item.songTitle,
            artistID: item.artistID,
            cover: item.cover,
            type: isAlbum ? "Album" : "Song"
        });
    };

    const handleSubmit = async () => {
        if (!selectedItem || !header || !rating) return;

        let html = rteRef.current.getHtml();

        // Append media attachments at the end
        if (mediaAttachments.length > 0) {
            const mediaHtml = mediaAttachments.map(media =>
                media.isVideo
                    ? `<video src="${media.url}" controls style="width:100%; border-radius:8px; margin: 8px 0;"></video>`
                    : `<img src="${media.url}" style="width:100%; border-radius:8px; margin: 8px 0;" />`
            ).join('');

            html += mediaHtml;
        }

        const reviewData = {
            user: activeUserID,
            artist: selectedItem.artistID,
            targetType: selectedItem.type,
            targetID: selectedItem._id,
            review_header: header,
            review_content: html,
            rating,
            likes: 0,
            dislikes: 0,
            isEdited: false
        };

        try {
            await createReview(reviewData);
            alert("Review submitted successfully!");
            setSelectedItem(null);
            setHeader("");
            setRating(0);
            if (rteRef.current) rteRef.current.value = "";
            onClose();
        } catch (error) {
            alert("Error saving review: " + error.message);
        }
    };

    const getArtistName = (id) => {
        const artist = artists.find(a => a._id === id);
        return artist ? artist.name : "Unknown Artist";
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2 className="modal-title">Write a Review</h2>

                <SearchBar
                    songs={songs}
                    albums={albums}
                    artists={artists}
                    onSelect={handleSelect}
                />

                <div className="review-form-area">
                    <div className="review-row">
                        <div className="selected-card">
                            {selectedItem ? (
                                <img src={selectedItem.cover} alt="Cover" />
                            ) : (
                                <div className="empty-box" />
                            )}
                            <div className="card-info">
                                <p className="item-title">{selectedItem?.title || ""}</p>
                                <span className="artist-subtitle">
                                    {selectedItem ? getArtistName(selectedItem.artistID) : ""}
                                </span>
                            </div>
                        </div>

                        <div className="rating-section">
                            <p className="rating-label">Star Rating</p>
                            <InteractiveStarRating
                                totalStars={5}
                                currentRating={currentRating || rating}
                                onRate={(val) => setRating(val)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            className="header-input"
                            placeholder="Header"
                            value={header}
                            onChange={(e) => setHeader(e.target.value)}
                        />

                        <RichTextEditorComponent
                            className="review-rte"
                            toolbarSettings={toolbarSettings}
                            htmlAttributes={{ "data-gramm": "false", "data-gramm_editor": "false" }}
                            ref={rteRef}
                        >
                            <Inject services={[Toolbar, Link, HtmlEditor, QuickToolbar]} />
                        </RichTextEditorComponent>
                    </div>

                    {/* Media preview strip with upload button */}
                    <div className="media-header">Upload Media</div>
                    <div className="media-preview-strip">
                        {/* Upload button */}
                        <label
                            className="media-upload-btn"
                            style={{ opacity: uploading ? 0.6 : 1, pointerEvents: uploading ? 'none' : 'auto' }}
                        >
                            {uploading ? "↻" : "＋"}
                            <input
                                ref={mediaInputRef}
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleMediaUpload}
                                style={{ display: 'none' }}
                            />
                        </label>

                        {mediaAttachments.map((media, i) => (
                            <div
                                key={i}
                                className="media-preview-thumb"
                                onClick={() => setLightbox(media)}
                            >
                                {media.isVideo ? (
                                    <video src={media.url} className="media-thumb" />
                                ) : (
                                    <img src={media.url} alt={`attachment-${i}`} className="media-thumb" />
                                )}
                                <div className="media-preview-overlay">
                                    <span>{media.isVideo ? "▶" : ""}</span>
                                </div>
                                <button
                                    className="media-delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent lightbox from opening
                                        setMediaAttachments(prev => prev.filter((_, idx) => idx !== i));
                                    }}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Lightbox popup */}
                    {lightbox && (
                        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
                            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                                <button className="lightbox-close" onClick={() => setLightbox(null)}>&times;</button>
                                {lightbox.isVideo ? (
                                    <video src={lightbox.url} controls autoPlay className="lightbox-media" />
                                ) : (
                                    <img src={lightbox.url} alt="preview" className="lightbox-media" />
                                )}
                            </div>
                        </div>
                    )}

                    <div className="footer">
                        <button
                            className="submit-btn"
                            onClick={handleSubmit}
                            disabled={!selectedItem || !header || !rating || uploading}
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewModal;