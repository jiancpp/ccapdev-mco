import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { StarRating } from '../../components/StarRating';
import { getReviewsForArtist } from '../../api/api';

import './ArtistBlock.css'

function ArtistBlock({ artist }) {
    const navigate = useNavigate();
    const[artistReviews, setArtistReviews] = useState([])
    const [loading, setLoading] = useState(true);

    /**
     * Fetch all artist reviews from database
     */
    useEffect(() => {
        const fetchArtistReviews = async () => {
            try {
                setLoading(true);
                const data = await getReviewsForArtist(artist._id);   // function in api.js
                setArtistReviews(data);
            } catch (err) {
                setError(err.message);
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        }    
        
        fetchArtistReviews();
    }, []);

    return (
        <div className="artist-block" onClick={ () => navigate(`/artists/artist-profile/${artist._id}`) }
            style={{ cursor: "pointer" }}
        >
            <div className='block-content'>
                <div className="profile">
                    <img src={artist.user.avatar} alt="" className="profile-img" />
                </div>
                <div className="artist-details">
                    <div className="top-block">
                        <div className="first-line flex">
                            <h3 className="name">{artist.name}</h3>
                        <div className="details">{artistReviews.length} reviews</div>
                        </div>
                        <div className="stars">
                            <StarRating rating={Number(artist.rating)} />
                        </div>
                    </div>
                    <div className="bottom-block">
                        <div className="description">{artist.user.bio}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArtistBlock