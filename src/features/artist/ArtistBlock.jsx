import { useNavigate } from 'react-router-dom';

import './ArtistBlock.css'
import { StarRating } from '../../components/StarRating';

function ArtistBlock({ artist }) {
    const navigate = useNavigate();

    return (
        <div className="artist-block" onClick={ () => navigate(`/artists/artist-profile/${artist._id}`) }
            style={{ cursor: "pointer" }}
        >
            <div className='block-content'>
                <div className="profile">
                    <img src={artist.photo} alt="" className="profile-img" />
                </div>
                <div className="artist-details">
                    <div className="top-block">
                        <div className="first-line flex">
                            <h3 className="name">{artist.name}</h3>
                        <div className="details">{artist.reviews} reviews</div>
                        </div>
                        <div className="stars">
                            <StarRating rating={Number(artist.rating)} />
                        </div>
                    </div>
                    <div className="bottom-block">
                        <div className="description">{artist.description}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArtistBlock