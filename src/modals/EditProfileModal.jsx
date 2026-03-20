import './EditProfileModal.css'

import { useMediaUpload } from '../components/useMediaUpload';
import { useState } from 'react';
import { updateData } from '../api/api';



function EditProfileModal({ isOpen, onClose, user, showAlert }) {
    // const { mediaAttachments, avatar, uploading, handleMediaUpload, deleteMedia, resetMedia, setMedia } = useMediaUpload(null, { multiple: false });
    const [newUsername, setNewUserName] = useState(user?.username || '');
    const [newBio, setNewBio] = useState(user?.bio || '');

    const handleReset = () => {
        setNewUserName(user?.username);
        setNewBio(user?.bio);
    };

    const handleSave = async () => {
        const userData = {
            ...user,
            username: newUsername,
            bio: newBio 
        };

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
                        {/* <div
                            className="picture"
                            style={{
                                backgroundImage: mediaAttachments?.url ? `url(${mediaAttachments.url})` : `url(${user.ava})`
                            }}
                        >
                            {uploading && (
                                <div className="upload-progress-container">
                                    <div className="upload-progress-bar"></div>
                                </div>
                            )}
                        </div>

                        <div className="upload">
                                <label className="media-upload-btn" data-tooltip="Upload Avatar">
                                    <i className={`bi ${uploading ? "bi-arrow-repeat" : "bi bi-cloud-upload"}`}></i>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleMediaUpload}
                                        style={{ display: 'none' }}
                                        disabled={uploading}
                                    />
                                </label>
                            </div> */}
                        <img src={`${user?.avatar || '/assets/default.jpg'}`} alt="" />
                        <div className="change-picture">
                            <i className="bi bi-upload"></i>
                            <span>Upload File</span>
                        </div>
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