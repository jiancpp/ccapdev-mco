import {
  RichTextEditorComponent, Toolbar, Image, Link, HtmlEditor, QuickToolbar, Inject
} from '@syncfusion/ej2-react-richtexteditor';
import { InteractiveStarRating } from '../components/StarRating';
import { SearchBar } from '../components/SearchBar';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createReview, getAllData, getArtist } from '../api/api';

import './ReviewModal.css';

function ReviewModal({ isOpen, onClose, preSelected, currentRating = null, activeUserID}) { 
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);

    const [selectedItem, setSelectedItem] = useState(null);
    const [header, setHeader] = useState("");
    const [rating, setRating] = useState(0);
    const rteRef = useRef(null); // Grabs content from  RTE

    const toolbarSettings = {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough', '|', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|', 'CreateLink', 'Image', '|', 'Undo', 'Redo']
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'my_review_preset'); // From Cloudinary Settings

        const response = await fetch('https://api.cloudinary.com/v1_1/dnldcpojq/image/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Cloudinary upload failed');

        const data = await response.json();
        return data.secure_url; // This is the final HTTPS link
    };

    const cloudinaryUrlRef = useRef(null);

    const onImageUploading = useCallback((args) => {
        const file = args.fileData.rawFile;

        uploadToCloudinary(file).then(url => {
            cloudinaryUrlRef.current = url;
        });

        args.fileData.rawFile = new File([], args.fileData.name);
    }, []);

    const onImageUploadSuccess = useCallback((args) => {
        const imgs = rteRef.current?.contentDocument?.querySelectorAll('img');
        if (imgs && cloudinaryUrlRef.current) {
            imgs.forEach(img => {
                if (img.src.startsWith('blob:') || img.src.startsWith('data:')) {
                    img.src = cloudinaryUrlRef.current;
                    cloudinaryUrlRef.current = null;
                }
            });
        }
    }, []);

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
            
            if (rteRef.current) {
                rteRef.current.value = ""; 
            }
        }
    }, [isOpen]);

    // fetch preselected review parameters (added by jia)
    useEffect(() => {
        const { targetID, targetType, title, artistID, cover } = preSelected || {};
        if (targetID && targetType) {
            setSelectedItem({
                _id: targetID,
                title: title,
                artistID: artistID, 
                cover: cover,
                type: targetType
            });
        } else {
            setSelectedItem(null)
        }
    }, [isOpen, preSelected])

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
        if (!selectedItem || !header || !rating) {
            return;
        }

        const reviewData = {
            user: activeUserID,           
            artist: selectedItem.artistID, 
            targetType: selectedItem.type, 
            targetID: selectedItem._id,    
            review_header: header,
            review_content: rteRef.current.getHtml(), 
            rating: rating,
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
            if (rteRef.current) {
                rteRef.current.value = ""; 
            }

            onClose();
        } catch (error) {
            alert("Error saving review: " + error.message);
        }
    };

    const getArtistName = (id) => {
        const artist = artists.find(a => a._id === id);
        return artist ? (artist.name) : "Unknown Artist";
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
                                <div className="empty-box">
                                </div>
                            )}
                            <div className="card-info">
                                <p className="item-title">
                                    {selectedItem?.title || ""}
                                </p>
                                <span className="artist-subtitle">
                                    {(() => {
                                        if (selectedItem) {
                                            return getArtistName(selectedItem.artistID);
                                        } else {
                                            return "";
                                        }
                                    })()}
                                </span>
                            </div>
                        </div>
                        
                        <div className="rating-section">
                            <p className="rating-label">Star Rating</p>
                            <InteractiveStarRating totalStars={5} currentRating={currentRating || rating} onRate={(val) => setRating(val)} />
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
                            insertImageSettings={{ 
                                saveUrl: 'http://localhost:5001/api/upload-image',
                                saveFormat: 'Base64'
                            }}
                            imageUploading={onImageUploading} 
                            imageUploadSuccess={onImageUploadSuccess}
                            htmlAttributes={{ "data-gramm": "false", "data-gramm_editor": "false" }}
                            ref={rteRef}
                        >
                            <Inject services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar]} />
                        </RichTextEditorComponent>
                    </div>

                    <div className="footer">
                        <button 
                            className="submit-btn" 
                            onClick={handleSubmit}
                            disabled={!selectedItem || !header || !rating}
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewModal