import './EditProfileModal.css'; // Inherit styling from your existing CSS
import { useState } from 'react';
import { updateData } from '../api/api';

function EditGenresModal({ isOpen, onClose, artist, showAlert }) {
    const [genres, setGenres] = useState(artist?.genre || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);        
        try {
            await updateData('artists', artist?._id, { genres: genres });
            onClose();
            window.location.reload();
        } catch (error) {
            showAlert({ message: 'Error updating genres' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`profile-modal-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
            <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                
                <h2 className="profile-modal-title">Edit Genres</h2>
                
                <div className="edit-container">
                    <div className="edit-details" style={{ width: '100%' }}> 
                        <div className="edit-item-container">
                            <label htmlFor="genres-input">Musical Genres:</label>
                            <textarea 
                                id='genres-input' 
                                placeholder="e.g. Rock/Jazz/Techno"
                                value={genres}
                                onChange={(e) => setGenres(e.target.value)}
                                rows="4"
                            />
                            <small style={{ color: '#888', marginTop: '5px', display: 'block' }}>
                                Separate genres with slash.
                            </small>
                        </div>

                        <button className='save' onClick={handleSave} disabled={loading}>
                            {loading ? 'Saving...' : 'Update Genres'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditGenresModal;