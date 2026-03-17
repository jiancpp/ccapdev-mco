import './ReviewEmbed.css'
import { dummySongs } from '../../data/dummySongs'
import { dummyAlbums } from '../../data/dummyAlbums'

function ReviewEmbed({ review, navigate }) {
    if (review.targetType === 'Song') {
        return (
            <div className="embed embed-album" onClick={() => navigate(`/artists/artist-profile/${review.artist_id}`)}>
                <div className="album-cover">
                    <img src={review?.targetID.cover || "/assets/torotottie.jpg"} alt="" />
                </div>
                <div className='album-details'>
                    <div className="line line-title">
                        <span className='icon album-title'><i className="bi bi-music-note"></i></span>
                        <span className='album-title'> {review.targetID.songTitle}</span>
                    </div>
                    <div className="line">
                        <span className='icon'><i className="bi bi-person-fill"></i></span>
                        <span>{review.artist}</span>
                    </div>
                    <div className="line">
                        <span className='icon'><i className="bi bi-disc-fill"></i></span>
                        <span>{review.targetID.albumTitle}</span>
                    </div>
                </div>
            </div>
        )
    } else if (review.targetType === 'Album') {
        return (
            <div className="embed embed-album" onClick={() => navigate(`/artists/artist-profile/${review.artist_id}`)}>
                <div className="album-cover">
                    <img src={review?.targetID.cover || "/assets/torotottie.jpg"} alt="" />
                </div>
                <div className='album-details'>
                    <div className="line line-title">
                        <span className='icon album-title'><i className="bi bi-disc-fill"></i></span>
                        <span className='album-title'> {review.targetID.albumTitle}</span>
                    </div>
                    <div className="line">
                        <span className='icon'><i className="bi bi-person-fill"></i></span>
                        <span>{review.artist}</span>
                    </div>
                    <div className="line">
                        <span className='icon'><i className="bi bi-music-note-beamed"></i></span>
                        <span>{review.songCount} tracks</span>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="embed embed-artist" onClick={() => navigate(`/artists/artist-profile/${review.artist_id}`)}>
                <span className='icon'><i className="bi bi-person-fill"></i></span>
                <span>{review.artist}</span>
            </div>
        )
    }
}

export default ReviewEmbed