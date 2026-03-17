import { useParams } from "react-router-dom"; // to use params from links or routes
import { useOutletContext } from "react-router-dom"; // to use params passed from Outlet
import { useNavigate } from "react-router-dom";

import "./UserProfile.css"
import Review from "../../features/review/Review";
import NothingBlock from "../../components/NothingBlock"
import LoadingBlock from "../../components/LoadingBlock"
import BackButton from "../../components/BackButton"

import { useState } from "react";
import { useEffect } from "react";
import { getLikedReviewsByUser, getReviewsByUser, getUser } from "../../api/api";

/***** Main Component *****/
function UserProfile() {
    // ------- Navigation ------ //
    const navigate = useNavigate();
    const [section, setSection] = useState("reviews");

    // ------------ Modals ---------- //
    const { activeUser, openProfileEdit } = useOutletContext();
    const [openFollowers, setOpenFollowers] = useState(false);
    const [openFollowing, setOpenFollowing] = useState(false);

    // -------- Fetch API --------- //
    const { user_id } = useParams();
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [liked_reviews, setLikedReviews] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [loadingLikes, setLoadingLikes] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await getUser(user_id);
                setUser(userData);
            } catch (error) {
                setError(error.message);
                console.log(error);
            } finally {
                setLoadingUser(false);
            }
        }
        loadUser();
    }, [user_id]);

    // Fetch reviews created by user
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsData = await getReviewsByUser(user_id);
                setReviews(reviewsData);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoadingReviews(false);
            }
        }
        fetchReviews();
    }, [user_id]);

    // Fetch liked reviews created by user
    useEffect(() => {
        const fetchLikedReviews = async () => {
            try {
                const reviewsData = await getLikedReviewsByUser(user_id);
                setLikedReviews(reviewsData);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoadingLikes(false);
            }
        }
        fetchLikedReviews();
    }, [user_id]);

    // ----- Error Handling ------ //
    if (!user) return <NothingBlock message={"User not found."} />
    if (loadingUser) return <LoadingBlock />;

    return (
        <div className="user-profile">
            <BackButton />
            {/* HEADER PROFILE */}
            <div className="header">
                <div className="banner"></div>
                <div className="profile-pic"><img src={user.avatar} alt="" /></div>
                {activeUser && user._id === activeUser._id ?
                    (<div
                        className="user-edit-profile-btn"
                        onClick={openProfileEdit}>
                        Edit Profile <i className="bi bi-pencil"></i>
                    </div>) :
                    (<div className="user-follow-btn">Follow</div>)
                }

            </div>
            <div className="user-profile-details indent">
                <div className="user-username">{user.username}</div>
                <div className="user-stats">
                    <span onMouseEnter={() => setOpenFollowers(true)} onMouseLeave={() => setOpenFollowers(false)}>
                        {user.followers.length} followers
                        <div
                            className={`user-stats-modal ${openFollowers ? "" : "hidden"}`}
                            onMouseLeave={() => setOpenFollowers(false)}>
                            <ul>
                                {user.followers.map((follower) => (
                                    <li onClick={() => navigate(`/profile/${follower._id}`)}>{follower.username}</li>
                                ))}
                            </ul>
                        </div>
                    </span>
                    <span>•</span>
                    <span onMouseEnter={() => setOpenFollowing(true)} onMouseLeave={() => setOpenFollowing(false)}>
                        {user.following.length} following
                        <div
                            className={`user-stats-modal ${openFollowing ? "" : "hidden"}`}
                            onMouseLeave={() => setOpenFollowing(false)}>
                            <ul>
                                {user.following.map((followed) => (
                                    <li onClick={() => navigate(`/profile/${followed._id}`)}>{followed.username}</li>
                                ))}
                            </ul>
                        </div>
                    </span>
                </div>
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
                        onChange={(e) => (setSection(e.target.value))} />
                    Reviews
                </label>
                <label className="user-nav-item likes">
                    <input
                        type="radio"
                        name="user-history"
                        value="likes"
                        checked={section === "likes"}
                        onChange={(e) => (setSection(e.target.value))} />
                    Likes
                </label>
            </div>
            <div className={`user-reviews indent ${section !== "reviews" ? "hidden" : ""}`}>
                {!loadingReviews ?
                    reviews.map((review) => (
                        <Review key={review._id} review={review} activeUser={activeUser} />
                    ))
                    :
                    (<LoadingBlock padding={"40px"} />)
                }
            </div>
            <div className={`user-likes indent ${section !== "likes" ? "hidden" : ""}`}>
                {!loadingLikes ?
                    (liked_reviews.map((review) => (
                        <Review key={review._id} review={review} activeUser={activeUser} />
                    ))) :
                    (<LoadingBlock padding={"40px"} />)
                }
            </div>
        </div>
    )
}

export default UserProfile;