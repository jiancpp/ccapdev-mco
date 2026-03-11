import { useNavigate, useParams } from 'react-router-dom';

import './ReviewReply.css'
import './Review.css'

import { dummyUsers } from "../../data/dummyUsers";
import { dummyArtists } from "../../data/dummyArtists";
import { useState } from "react";

const getArtistById = (id) =>
    dummyArtists.find((artist) => artist._id === id);

function ReviewReply({ review, activeUser }) {
    // Settings
    const [openOptions, setOpenOptions] = useState("hidden");
    const [deleteReview, setDeleteReview] = useState("visible");

    // Navigation
    const navigate = useNavigate();

    // Review Details
    const artist = getArtistById(review.artist_id);

    const artist_photo = artist?.photo
        ? "../" + artist.photo
        : "../assets/IVOfSpades.jfif";

    if (review?.reply !== "") {
        return (
            <div
                className={`post ${deleteReview} reply`}
                onClick={() => setOpenOptions("hidden")}
                onMouseLeave={() => setOpenOptions("hidden")}>
                {/* <div className="options"
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
                </div> */}

                <div className='post-content'>
                    <div className="profile">
                        <img src={artist.photo} alt="" />
                    </div>
                    <div className="review-details">
                        <div className='user'>
                            <span
                                className="username"
                                onClick={() => navigate(`/profile/${artist._id}`)}>
                                {review.artist}</span>  3hrs ago
                        </div>

                        <div className="description">{review.reply}</div>
                    </div>
                </div>
            </div>
        )
    } else {
        return null;
    }
}

export default ReviewReply