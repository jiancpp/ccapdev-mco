import './ReviewEmbed.css'

function ReviewEmbed({ review, navigate }) {
    const { targetType, targetID, artist } = review;


    if (targetType === 'Song') {
        console.log(` + Fetching Song Embed | Album: ${targetID.albumID}`)
        return (
            <div className="embed embed-album" onClick={() => navigate(`/artists/artist-profile/${review.artist._id}`)}>
                <div className="album-cover">
                    <img src={targetID.cover || targetID.albumID?.cover || "/assets/torotottie.jpg"} alt="" />                </div>
                <div className='album-details'>
                    <div className="line line-title" >
                        <span className='icon album-title'><i className="bi bi-music-note"></i></span>
                        <span className='album-title'> {review.targetID.songTitle}</span>
                    </div>
                    <div className="line">
                        <span className='icon'><i className="bi bi-person-fill"></i></span>
                        <span
                            className='link'
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/artists/artist-profile/${review}`);
                            }}>
                            {artist.name}
                        </span>
                    </div>
                    <div className="line">
                        <span className='icon'><i className="bi bi-disc-fill"></i></span>
                        <span
                            className='link'
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/albums/${targetID.albumID?._id}`);
                            }}>
                            {targetID.albumID?.albumName || "Single"}
                        </span>
                    </div>
                </div>
            </div>
        )
    } else if (review.targetType === 'Album') {
        return (
            <div className="embed embed-album" onClick={() => navigate(`/albums/${targetID._id}`)}>
                <div className="album-cover">
                    <img src={targetID?.cover || "/assets/torotottie.jpg"} alt="" />
                </div>
                <div className='album-details'>
                    <div className="line line-title">
                        <span className='icon album-title'><i className="bi bi-disc-fill"></i></span>
                        <span
                            className='album-title link-title'
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/albums/${targetID._id}`);
                            }}>
                            {targetID.albumName}</span>
                    </div>
                    <div className="line">
                        <span className='icon'><i className="bi bi-person-fill"></i></span>
                        <span
                            className='link'
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/artists/artist-profile/${review}`);
                            }}>
                            {artist.name}
                        </span>
                    </div>
                    <div className="line">
                        <span className='icon'><i className="bi bi-music-note-beamed"></i></span>
                        <span>{targetID.songCount} tracks</span>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="embed embed-artist" onClick={() => navigate(`/artists/artist-profile/${review.artist_id}`)}>
                <span className='icon'><i className="bi bi-person-fill"></i></span>
                <span>{artist.name}</span>
            </div>
        )
    }
}

export default ReviewEmbed