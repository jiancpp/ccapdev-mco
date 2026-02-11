import './ReviewEmbed.css'
import { dummySongs } from '../data/dummySongs'
import { dummyAlbums } from '../data/dummyAlbums'

/***** UTILITIES ******/
const getSongById = (id) => dummySongs.find((song) => song._id === id);
const getAlbumById = (id) => dummyAlbums.find((album) => album._id === id);

function ReviewEmbed({ review, navigate }) {
    // Artist Review
    console.log("Song: " + review.song_id + "; Album: " + review.album_id);

    if (review.song_id!==null) {
        const song = getSongById(review.song_id);
        const album = getAlbumById(review.album_id);
    
        return (
            <div className="embed embed-album" onClick={ () => navigate(`/artists/artist-profile/${review.artist_id}`)}>
                <div className="album-cover">
                    <img src={album.cover} alt="" />
                </div>
                <div className='album-details'>
                    <span className='album-title'>"{song.title}"</span><br />
                    <span className='icon'><i className="bi bi-disc-fill"></i></span>
                    <span>{album.title}</span><br />
                    <span className='icon'><i className="bi bi-person-fill"></i></span>
                    <span>{review.artist}</span>
                </div>
            </div>
        )
    } else if (review.album!==null) {
        const album = getAlbumById(review.album_id);

        return (
            <div className="embed embed-album" onClick={ () => navigate(`/artists/artist-profile/${review.artist_id}`)}>
                <div className="album-cover">
                    <img src={album.cover} alt="" />
                </div>
                <div className='album-details'>
                    <span className='album-title'>{album.title}</span><br />
                    <span className='icon'><i className="bi bi-person-fill"></i></span>
                    <span>{review.artist}</span><br />
                    <span className='icon'><i className="bi bi-music-note-beamed"></i></span>
                    <span>{album.songs} tracks</span>
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