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
import { checkIsFollowing, getLikedReviewsByUser, getReviewsByUser, getUser, toggleFollow } from "../../api/api";

/***** Main Component *****/
function UserProfile() {
    // ------- Navigation ------ //
    const navigate = useNavigate();
    const [section, setSection] = useState("reviews");

    // ------------ Modals ---------- //
    const { activeUser, openProfileEdit, showAlert } = useOutletContext();
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

    // -------- States --------- //
    const [isFollowing, setIsFollowing] = useState(false);

    // Fetch user
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const [userData, followStatus] = await Promise.all([
                    getUser(user_id),
                    activeUser?._id && activeUser._id !== user_id 
                        ? checkIsFollowing(activeUser._id, user_id) 
                        : Promise.resolve({ isFollowing: false })
                ]);

                if (!isMounted) return;

                setUser(userData);
                if (followData && typeof followData.isFollowing !== 'undefined') {
                    setIsFollowing(followData.isFollowing);
                }

            } catch (error) {
                if (isMounted) setError(error.message);
                console.log(error);
            } finally {
                if (isMounted) setLoadingUser(false);
            }
        }
        fetchData();    
        return () => { isMounted = false; };   
    }, [user_id, activeUser?._id]);

    // Fetch reviews created by user
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoadingReviews(true);
                const reviewsData = await getReviewsByUser(user_id);
                setReviews(reviewsData);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoadingReviews(false);
            }
        }
        fetchReviews();
    }, [user_id, section]);

    // Fetch liked reviews created by user
    useEffect(() => {
        const fetchLikedReviews = async () => {
            try {
                setLoadingLikes(true);
                const reviewsData = await getLikedReviewsByUser(user_id);
                setLikedReviews(reviewsData);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoadingLikes(false);
            }
        }
        fetchLikedReviews();
    }, [user_id, section]);

    const handleFollow = async () => {
        const wasFollowing = isFollowing;
        setIsFollowing(!wasFollowing);

        try {
            await toggleFollow(activeUser._id, user_id);
            
            // Local state update:
            setUser(prevUser => {
                const updatedFollowers = wasFollowing 
                    ? prevUser.followers.filter(f => String(f._id) !== String(activeUser._id)) // Forced string comparison
                    : [...prevUser.followers, { _id: activeUser._id, username: activeUser.username }];                
                return { ...prevUser, followers: updatedFollowers };
            });

            showAlert({message: 'Successfully updated following status.'})            
        } catch (error) {
            showAlert({
                message: 'Error updating following status.', 
                icon: 'bi-exclamation-circle-fill',
                bgColor: 'var(--error-light)',
                textColor: 'var(--error-dark)'
            })            
        }
    }

    // ----- Error Handling ------ //
    if (loadingUser) return <LoadingBlock />;
    if (!user) return <NothingBlock message={"User not found."} />

    return (
        <div className="user-profile">
            <BackButton />
            {/* HEADER PROFILE */}
            <div className="header">
                <div className="banner"></div>
                <div className="profile-pic"><img src={user.avatar} alt="" /></div>
                {
                    activeUser && user._id === activeUser._id ?
                    <div
                        className="user-edit-profile-btn"
                        onClick={() => { 
                            openProfileEdit();
                        }}>
                        Edit Profile <i className="bi bi-pencil"></i>
                    </div> :
                    <div 
                        className={`user-follow-btn ${isFollowing ? 'following' : ''}`}
                        onClick={handleFollow}>
                        {isFollowing ? 'Following' : 'Follow'}
                    </div> 
                }

            </div>
            <div className="user-profile-details indent">
                <div className="user-username">{user.username}</div>
                <div className="user-stats">
                    <span onMouseEnter={() => setOpenFollowers(true)} onMouseLeave={() => setOpenFollowers(false)}>
                        {user.followers.length} followers
                        {user.followers.length > 0 &&
                            <div
                                className={`user-stats-modal ${openFollowers ? "" : "hidden"}`}
                                onMouseLeave={() => setOpenFollowers(false)}>
                                <ul>
                                    {user.followers.map((follower) => (
                                        <li key={follower._id} onClick={() => navigate(`/profile/${follower._id}`)}>{follower.username}</li>
                                    ))}
                                </ul>
                            </div>
                        }
                    </span>
                    <span>•</span>
                    <span onMouseEnter={() => setOpenFollowing(true)} onMouseLeave={() => setOpenFollowing(false)}>
                        {user.following.length} following
                        {user.following.length > 0 &&
                            <div
                                className={`user-stats-modal ${openFollowing ? "" : "hidden"}`}
                                onMouseLeave={() => setOpenFollowing(false)}>
                                <ul>
                                    {user.following.map((followed) => (
                                        <li key={followed._id} onClick={() => navigate(`/profile/${followed._id}`)}>{followed.username}</li>
                                    ))}
                                </ul>
                            </div>
                        }
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
                {
                    !loadingReviews && reviews.length == 0 ? <NothingBlock /> :
                    !loadingReviews ?
                        reviews.map((review) => (
                            <Review key={review._id} review={review} activeUser={activeUser} />
                        )) :
                     <LoadingBlock padding={"40px"} />
                }
            </div>
            <div className={`user-likes indent ${section !== "likes" ? "hidden" : ""}`}>
                { 
                    !loadingLikes && liked_reviews.length == 0 ? <NothingBlock /> :
                    !loadingLikes ?
                        (liked_reviews.map((review) => (
                            <Review key={review._id} review={review} activeUser={activeUser} />
                        ))) : 
                    <LoadingBlock padding={"40px"} />
                }
            </div>
        </div>
    )
}

export default UserProfile;