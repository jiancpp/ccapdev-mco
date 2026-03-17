import { useNavigate } from 'react-router-dom'; 

import './Review.css'
import ReviewEmbed from './ReviewEmbed';
import ReviewReply from './ReviewReply';

import { dummyUsers } from "../../data/dummyUsers";
import { useState } from "react";
import { useEffect } from 'react';
import { getUser } from '../../api/api';

function Review({ review, activeUser }) {
    // Settings
        const [openOptions, setOpenOptions] = useState("hidden");
        const [deleteReview, setDeleteReview] = useState("visible");

        // Navigation
        const navigate = useNavigate();

        // Reactions
        const [selected, setSelected] = useState(null);
        const toggle = (reaction) => {
            setSelected((prev) => (prev===reaction ? null : reaction))
        }

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
                        {activeUser && activeUser._id === review.user ? 
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
                    <img src={review.user.avatar || "/assets/torotottie.jpg"} alt="" />
                </div>
                <div className="review-details">
                    <div className='user'>
                        <span 
                            className="username" 
                            onClick={ () => navigate(`/profile/${review.user}`) }>
                                {review.user.username}</span>  3hrs ago <span className={`edited ${review.isEdited ? "" : "hidden"}`}>(Edited)</span>
                    </div>

                    <div className='title'>{review.review_header}</div>
                    <div className='rating'>
                        { Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                            <i className="bi bi-star-fill" key={i}></i>
                        ))}
                        { Array.from({ length: 5 - Math.floor(review.rating) }).map((_, i) => (
                            <i className="bi bi-star-fill grey" key={i}></i>
                        ))}
                    </div>
                    <ReviewEmbed review={review} navigate={navigate}/>
                    <div className="description">{review.review_content}</div>
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
                    <span>{review.likes + (selected === "heart" ? 1 : 0)}</span>
                </div>
                <div 
                    className={`post-btn dislike ${selected === "dislike" ? "active" : ""}`}
                    onClick={() => toggle("dislike")}>
                    <span className='icon'>
                        <i className={`bi ${selected === "dislike" ? "bi-hand-thumbs-down-fill" : "bi-hand-thumbs-down"}`}></i>
                    </span>
                    <span className="gap"></span>
                    <span>{review.dislikes + (selected === "dislike" ? 1 : 0)}</span>
                </div>
                <div className="post-btn share">
                    <span className='icon'><i className="bi bi-share-fill"></i></span>
                </div>
            </div>
            
            {/* <ReviewReply key={review._id} review={review} activeUser={activeUser}/> */}
        </div>
    )
}

export default Review