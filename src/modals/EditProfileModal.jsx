import './EditProfileModal.css'

function EditProfileModal({ isOpen, onClose, user }) {

    return (
        <div className={`profile-modal-overlay ${isOpen ? "open" : ""}`} onClick={ onClose }>
            <div className="profile-modal-content" onClick={ (e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h2 className="profile-modal-title">Profile Details</h2>
                <div className="edit-container">
                    <div className="edit-picture">
                        {
                            user ? <img src={user.avatar} alt="" /> : ""
                        }
                        <div className="change-picture">
                            <i className="bi bi-upload"></i>
                            <span>Upload File</span>
                        </div>
                    </div>
                    <div className="edit-details">
                        <div className="edit-item-container">
                            <label htmlFor="username">Username: </label>
                            <input type="text" id='username' name='username' defaultValue={ user ? user.username : ""} />
                        </div>
                        <div className="edit-item-container">
                            <label htmlFor="user-bio">User bio: </label>
                            <textarea id='user-bio' name='user-bio' defaultValue={user ? user.bio : ""} />
                        </div>
                        <button className='save'>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfileModal