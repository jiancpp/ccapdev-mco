import { useParams } from "react-router-dom"; // to use params from links or routes
import { useNavigate } from "react-router-dom";
import { dummyUsers } from "../data/dummyUsers";

import './UserProfile.css'

/***** Utilities *****/
const getUserById = (id) => dummyUsers.find((user) => user._id === id); 

function UserProfileEdit() {
    const { user_id } = useParams();
    const user = getUserById(user_id)

    const navigate = useNavigate();
    const goBack = () => navigate(`/profile/${user_id}`)

    return (
        <div className="user-profile">
            <button className="back-btn" onClick={ goBack }>
                <i className="bi bi-arrow-left"></i> Back
            </button>
            
            <div className="header">
                <div className="banner"></div>
                <div className="profile-pic"><img src={user.avatar} alt="" /></div>
                
            </div>
        </div>
    )
}

export default UserProfileEdit
