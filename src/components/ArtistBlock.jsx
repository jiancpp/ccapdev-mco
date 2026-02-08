import './ArtistBlock.css'
import { StarRating } from './StarRating';

function ArtistBlock({ artist }) {
    return (
        <div className="artist-block">
            <div className='block-content'>
                <div className="profile"></div>
                <div className="artist-details">
                    <div className="top-block">
                        <h3 className="name">{artist.name}</h3>
                        <div className="stars">
                            <StarRating rating={Number(artist.rating)} />
                        </div>
                    </div>
                    <div className="bottom-block">
                        <div className="details">{artist.reviews} reviews</div>
                        <div className="details">{artist.songs} songs released</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArtistBlock