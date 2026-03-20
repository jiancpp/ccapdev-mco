import {
  RichTextEditorComponent, Toolbar, Link, HtmlEditor, QuickToolbar, Inject
} from '@syncfusion/ej2-react-richtexteditor';

import { InteractiveStarRating } from '../components/StarRating';
import { SearchBar } from '../components/SearchBar';
import { MediaPreviewStrip } from '../components/MediaPreviewStrip';
import AlertBlock from '../components/AlertBlock';

import { useNavigate, useOutletContext } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { createReview, getAllData, updateData } from '../api/api';

import './ReviewModal.css';

export default function ReviewModal({ isOpen, onClose, activeUserID, preSelected, currentRating = null }) {
    // List of data
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);

    // Review content
    const [selectedItem, setSelectedItem] = useState(null);
    const [header, setHeader] = useState("");
    const [rating, setRating] = useState(0);
    const [mediaAttachments, setMediaAttachments] = useState([]);
    const [modalMode, setModalMode] = useState("Write")

    // Settings
    const rteRef = useRef(null);
    const mediaInputRef = useRef(null);

    const [uploading, setUploading] = useState(false);
    const [isAlertOn, setIsAlertOn] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        message: '',
        icon: '',
        bgColor: 'var(--success-light)',
        textColor: 'var(--success-dark)'
    });
    
    const showAlert = (config) => {
        setAlertConfig(config);
        setIsAlertOn(true);
        setTimeout(() => setIsAlertOn(false), 2000); // Reset after 2 seconds
    };

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
        if (!isOpen) {
            setSelectedItem(null);
            setHeader("");
            setRating(0);
            setMediaAttachments([]);
            if (rteRef.current) rteRef.current.value = "";
            setModalMode("Write"); // <--- Add this reset!
            return;
        }

    
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

        // Handle edit and quick create mode
        if (preSelected) {
            console.log("ACTUAL OBJECT KEYS:", Object.keys(preSelected));
            setHeader(preSelected.header || "");
            setRating(preSelected.rating || 0);
            setMediaAttachments(preSelected.media || []);
            setSelectedItem({
                _id: preSelected.targetID,
                title: preSelected.title,
                artistID: preSelected.artistID,
                cover: preSelected.cover,
                type: preSelected.targetType
            });
            // Update the Rich Text Editor value
            setTimeout(() => {
                if (rteRef.current) {
                    rteRef.current.value = preSelected.content || "";
                }
            }, 0);

            // Determine whether user is creating or editing a review
            setModalMode(preSelected.mode);
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
        const finalRating = rating || currentRating; 
        if (!selectedItem || !header || !finalRating) return;
        let html = rteRef.current.getHtml();

        const reviewData = {
            user: activeUserID,
            artist: selectedItem.artistID,
            targetType: selectedItem.type,
            targetID: selectedItem._id,
            review_header: header,
            review_content: rteRef.current.getHtml(),  // check if this breaks it
            media: mediaAttachments,
            rating: currentRating || rating,
            likes: 0,
            dislikes: 0,
            isEdited: false
        };

        try {
            console.log("FINAL REVIEW DATA: " + JSON.stringify(reviewData));
            console.log(modalMode);
            if (modalMode === "Edit") {
                await updateData('reviews', preSelected.id, reviewData);
                alert("Review updated successfully!");
            }
            else {
                await createReview(reviewData);
                showAlert({message: 'Review submitted successfully!'})
            }
            
            setSelectedItem(null);
            setHeader("");
            setRating(0);
            if (rteRef.current) rteRef.current.value = "";
            onClose();
        } catch (error) {
            showAlert({
                message: 'Failed to create review.',
                icon: '',
                bgColor: 'var(--error)', 
                textColor: '#000000'
            });
        }
    };

    const getArtistName = (id) => {
        const artist = artists.find(a => a._id === id);
        return artist ? artist.name : "Unknown Artist";
    };

    console.log("Current State Render Check:", { header, rating, selectedItem });
    const isFormInvalid = !selectedItem || !header.trim() || !(rating || currentRating) || uploading;
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
                {isAlertOn && <AlertBlock
                    message={ alertConfig.message }
                    icon={alertConfig.icon }
                    bgColor={alertConfig.bgColor} 
                    textColor={alertConfig.textColor}
                />}
                <button className="close-btn" onClick={onClose}>&times;</button>
                <div className="header">
                    <h2 className="modal-title">{modalMode || "Write"} a Review</h2>
                    <SearchBar
                            songs={songs}
                            albums={albums}
                            artists={artists}
                            onSelect={handleSelect}
                        />
                </div>
                <div className="modal-scroll">
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
                        <div className="media-group">
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
                            <MediaPreviewStrip
                                media={mediaAttachments}
                                onDelete={(i) => setMediaAttachments(prev => prev.filter((_, idx) => idx !== i))}
                            />
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <button
                        className="submit-btn"
                        onClick={handleSubmit}
                        disabled={isFormInvalid}
                    >
                        {modalMode == "Write" ? "Submit" : "Save"} Review
                    </button>
                </div>
            </div>
        </div>
    );
}

export function EditReviewModal({ isOpen, onClose, review, activeUserID }) {
    if (!review) return null;
    const reviewData = {
        id: review._id,
        header: review.review_header,
        content: review.review_content,
        media: review.media || [],
        rating: review.rating, // ADD THIS LINE
        // Polymorphic target
        title: review.targetType === 'Album' ? review.targetID?.albumName : review.targetID?.songTitle,
        targetID: review.targetID?._id,
        targetType: review.targetType,
        artistID: review.artist?._id || review.artist,
        cover: review.targetID?.cover,
        mode: review.mode || 'Write'
    };
    console.log(` + checking before edit review ${review.review_header} ${review.review_content} ${review.media} `);
    console.log(` + checking edit review ${reviewData.header} ${reviewData.content} ${reviewData.media} `);


    return (
        <ReviewModal 
            key={review._id}
            isOpen={isOpen}
            onClose={onClose}
            activeUserID={activeUserID}
            preSelected={reviewData} // ONLY ONE PROP for the data!
            currentRating={review.rating}
        />
    );
}