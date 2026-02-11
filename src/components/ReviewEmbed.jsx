import './ReviewEmbed.css'

function ReviewEmbed({ review }) {
    // Artist Review
    if (review.song!==null) {
        return null
    } else if (review.album!==null) {
        return (
            <div className="embed embed-album">
                <div className="album-cover">
                    <img src="/assets/Silakbo.jpg" alt="" />
                </div>
                <div className='album-details'>
                    <span className='album-title'>{review.album}</span><br />
                    <span className='icon'><i className="bi bi-person-fill"></i></span>
                    <span>{review.artist}</span><br />
                    <span className='icon'><i className="bi bi-music-note-beamed"></i></span>
                    <span>15 tracks</span>
                </div>
            </div>
        )
    } else {
        return (
            <div className='embed embed-artist'>
                <span className='icon'><i className="bi bi-person-fill"></i></span>
                <span>{review.artist}</span>
            </div>
        )
    }    
}

export default ReviewEmbed