import { useParams, useNavigate } from "react-router-dom";

import "./ArtistProfile.css"
import Review from "../components/Review";
import { StarRating } from "../components/StarRating";

import { dummyArtists } from "../data/dummyArtists";
import { dummyReviews } from "../data/dummyReviews";

const getArtistById = (id) => dummyArtists.find((artist) => artist._id === id);
const getReviewsByArtist = (artist_id) => dummyReviews.filter((review) => review.artist_id === artist_id);

function ArtistProfile() {
    const navigate = useNavigate();
    const { artist_id } = useParams();

    const artist = getArtistById(artist_id);    
    const reviews = getReviewsByArtist(artist_id);

    if (!artist) return( <div style={{ padding: "20px" }}>Artist not found</div> )

    return (
        <div className="artist-profile">
            <button className="back-btn" onClick={ () => navigate("/artists")}>
                <i className="bi bi-arrow-left"></i> Back
            </button>

            <div className="header">
                <div className="banner"></div>
                
                <div className="profile-pic">
                    <img src={artist.photo} alt={artist.name} />
                </div>
                
            </div>

            <div className="artist-profile-details indent">
                <div className="artist-name">{artist.name}</div>

                <div className="artist-rating">
                    <span className="stars">
                        <StarRating rating = {Number(artist.rating)}/>
                    </span> 
                </div>

                <div className="artist-meta">
                    <span className="country">{artist.country}</span>
                </div>
            </div>

            <div className="artist-nav indent">
                <button className="nav-item active">Reviews</button>
                <button className="nav-item">Songs ({artist.songs})</button>
                <button className="nav-item">Albums</button>
            </div>

            <div className="rate-review-section indent">
                <h3>Rate and Review</h3>
                <div className="user-input-row">
                    <div className="user-avatar-small"></div>
                    <div className="empty-stars">★★★★★</div>
                </div>
            </div>

            <div className="artist-reviews indent">
                {reviews.map((review) => (
                    <Review key={review._id} review={review} setActivePage={setActivePage}/>
                ))}
            </div>
        </div>
    )
}

export default ArtistProfile;