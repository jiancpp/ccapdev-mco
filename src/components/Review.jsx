import { useNavigate } from 'react-router-dom'; 

import './Review.css'
import ReviewEmbed from './ReviewEmbed';

import { dummyUsers } from "../data/dummyUsers";
import { useState } from "react";

const getUserById = (id) =>
  dummyUsers.find((user) => user._id === id);

function Review({ review }) {
    // Navigation
    const navigate = useNavigate();

    // Review Details
    const user = getUserById(review.user_id);

    // Reactions
    const [selected, setSelected] = useState(null);
    const toggle = (reaction) => {
        setSelected((prev) => (prev===reaction ? null : reaction))
    }

    return (
        <div className="post">
            <div className='post-content'>
                <div className="profile">
                    <img src={user.avatar} alt="" />
                </div>
                <div className="review-details">
                    <div className='user'>
                        <span 
                            className="username" 
                            onClick={ () => navigate(`/profile/${user._id}`) }>
                                {user.username}</span> {user._id} 3hrs ago
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
                    <ReviewEmbed review={review}/>
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
                    <span>{review.likes}</span>
                </div>
                <div 
                    className={`post-btn dislike ${selected === "dislike" ? "active" : ""}`}
                    onClick={() => toggle("dislike")}>
                    <span className='icon'>
                        <i className={`bi ${selected === "dislike" ? "bi-hand-thumbs-down-fill" : "bi-hand-thumbs-down"}`}></i>
                    </span>
                    <span className="gap"></span>
                    <span>{review.dislikes}</span>
                </div>
                <div className="post-btn share">
                    <span className='icon'><i className="bi bi-share-fill"></i></span>
                </div>
            </div>
        </div>
    )
}

export default Review