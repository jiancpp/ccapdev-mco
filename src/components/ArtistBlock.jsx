import './ArtistBlock.css'
import { StarRating } from './StarRating';

function ArtistBlock({ artist, setActivePage }) {
    return (
        <div className="artist-block" onClick={() => setActivePage({ page: "artist", params: { id: artist._id } })}
            style={{ cursor: "pointer" }}
        >
            <div className='block-content'>
                <div className="profile">
                    <img src={artist.photo} alt="" className="profile-img" />
                </div>
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