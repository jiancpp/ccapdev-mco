import "./UserProfile.css"
import Review from "../components/Review";

import { dummyUsers } from "../data/dummyUsers";
import { dummyReviews } from "../data/dummyReviews";

const getUserById = (id) => dummyUsers.find((user) => user._id === id);
const getReviewsByUser = (user_id) => dummyReviews.filter((review) => review.user_id === user_id);

function UserProfile({ user_id, setActivePage }) {
    const user = getUserById(user_id);    
    const reviews = getReviewsByUser(user_id);

    return (
        <div className="user-profile">
            <button className="back" onClick={() => setActivePage({page: "home", params: {}})}>Back</button>
            <div className="header">
                <div className="banner"></div>
                <div className="profile-pic"><img src={user.avatar} alt="" /></div>
                <div className="user-follow-btn">Follow</div>
            </div>
            <div className="user-profile-details indent">
                <div className="user-username">{user.username}</div>
                <div className="user-stats">6 followers  •  6 following</div>
                <div className="user-bio">{user.bio}</div>
            </div>
            <div className="user-profile-nav indent">
                <button className="user-nav-item">Reviews</button>
                <button className="user-nav-item">Likes</button>
            </div>
            <div className="user-reviews indent">
                {reviews.map((review) => (
                    <Review key={review._id} review={review} setActivePage={setActivePage}/>
                ))}
            </div>
        </div>
    )
}

export default UserProfile;