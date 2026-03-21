import './EditProfileModal.css'

import { useMediaUpload } from '../components/useMediaUpload';
import { useEffect, useState } from 'react';
import { updateData } from '../api/api';



function EditProfileModal({ isOpen, onClose, user, showAlert }) {
    const { mediaAttachments: avatar, uploading, handleMediaUpload, deleteMedia, resetMedia, setMedia } = useMediaUpload(null, { multiple: false });
    const [newUsername, setNewUserName] = useState(user?.username || '');
    const [newBio, setNewBio] = useState(user?.bio || '');

    useEffect(() => {
        if (!isOpen) {
            resetMedia();
        } else {
            setMedia(user?.avatar ? { url: user.avatar } : null);
        }
    }, [isOpen, user?.avatar]);

    const handleReset = () => {
        setNewUserName(user?.username);
        setNewBio(user?.bio);
    };

    const handleSave = async () => {
        const userData = {
            ...user,
            username: newUsername,
            bio: newBio,
            avatar: avatar?.url || user?.avatar
        };

        console.log(userData);

        try {
            await updateData('users', user?._id, userData);
            onClose();
            handleReset();
            window.location.reload(); // fix this later
        } catch (error) {
            showAlert({message: 'Error updating profile'})
        }
    }
    return (
        <div className={`profile-modal-overlay ${isOpen ? "open" : ""}`} onClick={ onClose }>
            <div className="profile-modal-content" onClick={ (e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2 className="profile-modal-title">Profile Details</h2>
                <div className="edit-container">
                    <div className="edit-picture">
                        {avatar?.url && avatar?.url !== '/assets/default.jpg' && (
                            <button
                                className="avatar-delete-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    deleteMedia();
                                    setMedia({ url: '/assets/default.jpg' });
                                }}
                            >
                                &times;
                            </button>
                        )}
                        <label
                            className="media-upload-btn avatar-upload"
                            style={{ 
                                pointerEvents: uploading ? 'none' : 'auto',
                                backgroundImage: avatar?.url ? `url(${avatar.url})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {!avatar?.url && (uploading ? "↻" : "")}
                            <div className="avatar-edit-overlay">
                                {uploading ? "↻" : "✎"}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleMediaUpload}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                    <div className="edit-details">
                        <div className="edit-item-container">
                            <label htmlFor="username">Username: </label>
                            <input 
                                type="text" 
                                id='username' 
                                name='username' 
                                defaultValue={ user ? user.username : ""} 
                                onChange={(e) => setNewUserName(e.target.value)}
                            />
                        </div>
                        <div className="edit-item-container">
                            <label htmlFor="user-bio">User bio: </label>
                            <textarea 
                                id='user-bio' 
                                name='user-bio' 
                                defaultValue={user ? user.bio : ""} 
                                onChange={(e) => setNewBio(e.target.value)}
                            />
                        </div>
                        <button className='save' onClick={handleSave}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfileModal