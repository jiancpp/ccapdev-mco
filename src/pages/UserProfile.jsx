import { useParams } from "react-router-dom"; // to use params from links or routes
import { useOutletContext } from "react-router-dom"; // to use params passed from Outlet
import { useNavigate } from "react-router-dom";

import "./UserProfile.css"
import Review from "../components/Review";
import NothingBlock from "../components/NothingBlock"

import { dummyUsers } from "../data/dummyUsers";
import { dummyReviews } from "../data/dummyReviews";
import { trendingReviews } from "../data/trendingReviews";
import { useState } from "react";

/***** Utilities ******/
const getUserById = (id) => dummyUsers.find((user) => user._id === id);
const getReviewById = (id) => {
    var review = dummyReviews.find((review) => review._id === id);
    if (!review) review = trendingReviews.find((review) => review._id === id);
    return review;
}
const getReviewsByUser = (user_id) => {
    const reviews = dummyReviews.filter((review) => review.user_id === user_id);
    const trending = trendingReviews.filter((review) => review.user_id === user_id)
    return reviews.concat(trending);
}

/***** Main Component *****/
function UserProfile() {
    // ------- Helper Utilities ------ //
    const navigate = useNavigate();
    const goToHome = () => navigate("/")
    const [section, setSection] = useState("reviews");
    const { activeUser, openProfileEdit } = useOutletContext();

    const { user_id } = useParams();
    const user = getUserById(user_id);    

    // ----- Error Handling ------ //
    if (!user) return( <div style={{ padding: "20px" }}>User not found</div> )

    // ------ Data from User ------ //
    const followers = user.followers.map((id) => getUserById(id));
    const following = user.following.map((id) => getUserById(id));
    const reviews = getReviewsByUser(user_id);
    const liked_reviews = user.liked.map((id) => getReviewById(id));

    return (
        <div className="user-profile">
            <button className="back-btn" onClick={ goToHome }>
                <i className="bi bi-arrow-left"></i> Back
            </button>

            {/* HEADER PROFILE */}
            <div className="header">
                <div className="banner"></div>
                <div className="profile-pic"><img src={user.avatar} alt="" /></div>
                { user._id !== activeUser._id ? 
                    (<div className="user-follow-btn">Follow</div>) :
                    (<div 
                        className="user-edit-profile-btn"
                        onClick={ openProfileEdit }>
                            Edit Profile <i className="bi bi-pencil"></i>
                    </div>)
                }
                
            </div>
            <div className="user-profile-details indent">
                <div className="user-username">{user.username}</div>
                <div className="user-stats">{user.followers.length} followers  •  {user.following.length} following</div>
                <div className="user-bio">{user.bio}</div>
            </div>

            {/* USER HISTORY (e.g. REVIEW, LIKES) */}
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
                    <Review key={review._id} review={review} activeUser={activeUser} />
                ))}
            </div>
            <div className={`user-likes indent ${section!=="likes" ? "hidden" : ""}`}>
                {liked_reviews.length > 0 ? 
                    (liked_reviews.map((review) => (
                        <Review key={review._id} review={review} activeUser={activeUser} />
                    ))) :
                    (<NothingBlock />)
                }
            </div>
        </div>
    )
}

export default UserProfile;