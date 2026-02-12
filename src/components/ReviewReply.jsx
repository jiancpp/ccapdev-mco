import { useNavigate, useParams } from 'react-router-dom';

import './ReviewReply.css'
import './Review.css'

import { dummyUsers } from "../data/dummyUsers";
import { dummyArtists } from "../data/dummyArtists";
import { useState } from "react";

const getUserById = (id) =>
    dummyUsers.find((user) => user._id === id);

const getArtistById = (id) =>
    dummyArtists.find((artist) => artist._id === id);

function ReviewReply({ review, activeUser }) {
    // Settings
    const [openOptions, setOpenOptions] = useState("hidden");
    const [deleteReview, setDeleteReview] = useState("visible");

    // Navigation
    const navigate = useNavigate();

    // Review Details
    const user = getUserById(review.user_id);
    const artist = getArtistById(review.artist_id);

    const artist_photo = artist?.photo
        ? "../" + artist.photo
        : "../assets/IVOfSpades.jfif";

    if (review?.reply !== "") {
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
                        {activeUser._id === review.user_id ?
                            (<>
                                <li>
                                    <span><i className="bi bi-pencil-fill"></i></span><span>Edit</span>
                                </li>
                                <li onClick={() => setDeleteReview("hidden")} >
                                    <span><i className="bi bi-trash-fill"></i></span><span>Delete</span>
                                </li>
                            </>
                            ) :
                            (
                                <>
                                    <li onClick={() => setDeleteReview("hidden")} >
                                        <span><i className="bi bi-eye-slash-fill"></i></span><span>Hide Review</span>
                                    </li>
                                </>
                            )
                        }
                    </ul>
                </div>

                <div className='post-content'>
                    <div className="profile">

                        <img src={artist_photo} alt="" />
                    </div>
                    <div className="review-details">
                        <div className='user'>
                            <span
                                className="username"
                                onClick={() => navigate(`/profile/${user._id}`)}>
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