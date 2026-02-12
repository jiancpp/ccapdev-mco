import { useNavigate, useParams } from 'react-router-dom';
import { useOutletContext } from "react-router-dom";

import './ArtistViewReview.css'
import "./Review.css";
import ReviewEmbed from './ReviewEmbed';
import ReviewReply from './ReviewReply';

import { dummyUsers } from "../data/dummyUsers";
import { useState } from "react";

const getUserById = (id) =>
    dummyUsers.find((user) => user._id === id);

function ArtistViewReview({ review, activeUser }) {
    // Settings
    const [openOptions, setOpenOptions] = useState("hidden");
    const [deleteReview, setDeleteReview] = useState("visible");

    const { openModal } = useOutletContext();

    // Navigation
    const navigate = useNavigate();

    // Review Details
    const user = getUserById(review.user_id);

    // Reactions
    const [selected, setSelected] = useState(null);
    const toggle = (reaction) => {
        setSelected((prev) => (prev === reaction ? null : reaction))
    }

    return (
        <div
            className={`post ${deleteReview}`}
            onClick={() => setOpenOptions("hidden")}
            onMouseLeave={() => setOpenOptions("hidden")}>
            <div className="options"
                onClick={(e) => {
                    e.stopPropagation(); // stops triggering parent event
                    setOpenOptions("visible")
                }}>
                <i className="bi bi-three-dots"></i>
            </div>
            <div className={`options-modal ${openOptions}`}>
                <ul onClick={(e) => (e.stopPropagation())}>
                    <li>
                        <span><i className="bi bi-pencil-fill"></i></span><span>Edit</span>
                    </li>
                    <li onClick={() => setDeleteReview("hidden")} >
                        <span><i className="bi bi-trash-fill"></i></span><span>Delete</span>
                    </li>
                </ul>
            </div>

            <div className='post-content'>
                <div className="profile">
                    <img src={user.avatar} alt="" />
                </div>
                <div className="review-details">
                    <div className='user'>
                        <span
                            className="username"
                            onClick={() => navigate(`/profile/${user._id}`)}>
                            {user.username}</span>  3hrs ago
                    </div>

                    <div className='title'>{review.review_header}</div>
                    <div className='rating'>
                        {Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                            <i className="bi bi-star-fill" key={i}></i>
                        ))}
                        {Array.from({ length: 5 - Math.floor(review.rating) }).map((_, i) => (
                            <i className="bi bi-star-fill grey" key={i}></i>
                        ))}
                    </div>
                    <ReviewEmbed review={review} navigate={navigate} />
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
                <div
                    className="post-btn reply"
                    onClick={openModal}>
                    <span className='icon'><i className="bi-reply-fill"></i></span>
                </div>
            </div>
            <ReviewReply key={review._id} review={review} activeUser={activeUser} />
        </div>
    )
}

export default ArtistViewReview