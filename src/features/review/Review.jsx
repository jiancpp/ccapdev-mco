import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from 'react-router-dom'; 
import { getIsReactedByUser, postReaction, getTimeAgo, isReviewEdited, copyLink } from '../../api/api';

// import '@syncfusion/ej2-react-richtexteditor/styles/material.css';
import './Review.css'
import ReviewEmbed from './ReviewEmbed';
import ReviewReply from './ReviewReply';
import { StarRating } from "../../components/StarRating";

function Review({ review, activeUser }) {
    // Settings
    const [openOptions, setOpenOptions] = useState("hidden");
    const [deleteReview, setDeleteReview] = useState("visible");
    const { showAlert } = useOutletContext();

    // Review Data
    const [likes, setLikes] = useState(review.likes);
    const [dislikes, setDislikes] = useState(review.dislikes);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const checkReaction = async () => {
            const data = await getIsReactedByUser(review._id, activeUser?._id);

            // Add error handling
            if (data && data.reacted) {
                setSelected(data.type === 'like' ? 'heart' : 'dislike');
            }
        }
        if (activeUser?._id) checkReaction();
    }, [review._id, activeUser?._id]);

    const handleReact = async (reactType) => {
        try {
            await postReaction(review._id, activeUser._id, reactType);
        } catch (error) {
            alert("Error saving review: " + error.message);
        }
    }

    // Navigation
    const navigate = useNavigate();

    // Handle Toggle Reactions
    const toggle = (clickedReact) => {
        if (!activeUser) return;
        const oldReact = selected;
        const newReact = oldReact === clickedReact ? null : clickedReact;
        setSelected(newReact);

        updateLocalCounts(oldReact, newReact);

        const reactType = newReact === 'heart' ? 'like' : (newReact || null);
        handleReact(reactType); 
    }

    const updateLocalCounts = (oldReact, newReact) => {
        // Case 1: Unclick like button or click dislike 
        if (oldReact === 'heart' && newReact !== 'heart') {
            setLikes(prev => prev - 1); // decrement
        } else if (oldReact !== 'heart' && newReact === 'heart') {
            setLikes(prev => prev + 1); // increment
        }

        // Case 2: Unclick dislike button or click like 
        if (oldReact === 'dislike' && newReact !== 'dislike') {
            setDislikes(prev => prev - 1); // decrement
        } else if (oldReact !== 'dislike' && newReact === 'dislike') {
            setDislikes(prev => prev + 1); // increment
        }
    }

    console.log(review._id);

    return (
        <div 
            className={`post ${deleteReview}`} 
            onClick={ () => setOpenOptions("hidden")} 
            onMouseLeave={ () => setOpenOptions("hidden") }>
            <div className="options" 
                onClick={ (e) => {
                e.stopPropagation(); // stops triggering parent event
                setOpenOptions("visible")
            }}>
                <i className="bi bi-three-dots"></i>
            </div>

            <div className={`options-modal ${openOptions}`}>
                <ul onClick={ (e) => (e.stopPropagation())}>
                    {activeUser && activeUser._id === review.user._id ? 
                        (   <>
                            <li>
                                <span><i className="bi bi-pencil-fill"></i></span><span>Edit</span>
                            </li>
                            <li onClick={ () => setDeleteReview("hidden") } >
                                <span><i className="bi bi-trash-fill"></i></span><span>Delete</span>
                            </li>
                            </>
                        ) :
                        (
                            <>
                            <li onClick={ () => setDeleteReview("hidden") } >
                                <span><i className="bi bi-eye-slash-fill"></i></span><span>Hide Review</span>
                            </li>
                            </>
                        )
                    }
                </ul>
            </div>

            <div className='post-content'>
                <div className="profile">
                    <img src={review.user?.avatar || "/assets/torotottie.jpg"} alt="" />
                </div>
                <div className="review-details">
                    <div className='user'>
                        <span 
                            className="username" 
                            onClick={ () => navigate(`/profile/${review.user._id}`) }>
                                {review.user?.username || "User unknown"}</span> · {getTimeAgo(review.createdAt)} 
                                <span className={`edited ${isReviewEdited(review.createdAt, review.updatedAt) ? "" : "hidden"}`}> (Edited)</span>
                    </div>

                    <div className='title'>{review.review_header}</div>
                    <div className='rating'>
                        <StarRating rating={Number(review.rating || 0)} />
                    </div>
                    <ReviewEmbed review={review} navigate={navigate}/>
                    <div className="description" dangerouslySetInnerHTML={{ __html: review.review_content }} />
                </div>
            </div>
            <div className="post-actions flex">
                <div 
                    className={`post-btn heart ${selected === "heart" ? "active" : ""}`}
                    onClick={() => toggle("heart")}>
                    <span className='icon'>
                        <i className={`bi ${selected === "heart" ? "bi-heart-fill" : "bi-heart"}`}></i>
                    </span>
                    <span className="gap"></span>
                    <span>{likes}</span>
                </div>
                <div 
                    className={`post-btn dislike ${selected === "dislike" ? "active" : ""}`}
                    onClick={() => toggle("dislike")}>

                    <span className='icon'>
                        <i className={`bi ${selected === "dislike" ? "bi-hand-thumbs-down-fill" : "bi-hand-thumbs-down"}`}></i>
                    </span>
                    <span className="gap"></span>
                    <span>{dislikes}</span>
                </div>
                <div className="post-btn share" onClick={() => copyLink('review', review._id, showAlert)}>
                    <span className='icon'><i className="bi bi-share-fill"></i></span>
                </div>
            </div>
            
            {/* <ReviewReply key={review._id} review={review} activeUser={activeUser}/> */}
        </div>
    )
}

export default Review