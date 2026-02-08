import "./UserProfile.css"
import Review from "../components/Review";

import { dummyUsers } from "../data/dummyUsers";
import { dummyReviews } from "../data/dummyReviews";
import { useState } from "react";

const getUserById = (id) => dummyUsers.find((user) => user._id === id);
const getReviewsByUser = (user_id) => dummyReviews.filter((review) => review.user_id === user_id);

function UserProfile({ user_id, setActivePage }) {
    const user = getUserById(user_id);    
    const reviews = getReviewsByUser(user_id);

    const [section, setSection] = useState("reviews");

    return (
        <div className="user-profile">
            <button className="back-btn" onClick={() => setActivePage({page: "home", params: {}})}>
                <i className="bi bi-arrow-left"></i> Back
            </button>
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
                <label className="user-nav-item reviews">
                    <input 
                        type="radio" 
                        name="user-history" 
                        value="reviews"
                        checked={section === "reviews"}
                        onChange={(e) => (setSection(e.target.value))}/>
                    Reviews
                </label>
                <label className="user-nav-item likes">
                    <input 
                        type="radio" 
                        name="user-history" 
                        value="likes"
                        checked={section === "likes"}
                        onChange={(e) => (setSection(e.target.value))}/>
                    Likes
                </label>
            </div>
            <div className={`user-reviews indent ${section!=="reviews" ? "hidden" : ""}`}>
                {reviews.map((review) => (
                    <Review key={review._id} review={review} setActivePage={setActivePage}/>
                ))}
            </div>
            <div className={`user-likes indent ${section!=="likes" ? "hidden" : ""}`}>
                <div><i className="bi bi-emoji-neutral"></i></div>
                <div>Nothing here yet.</div>
            </div>
        </div>
    )
}

export default UserProfile;