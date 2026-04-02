function ReplyForm({ review, activeUser }) {


    return (
        <div className="reply-form">
            <div className='post-content'>
                <div className="profile avatar-picture"
                    style={{
                        backgroundImage: review?.artist?.user ? `url(${review.artist.user.avatar})` : undefined,
                        marginRight: '15px'
                    }}>
                </div>
                <div className="review-details">
                    <span className="reply-label">Replying as <span className="username">{review.artist.name}</span></span>
                    <form className="reply-form-element">
                        <div className="reply-input-container">
                            <textarea 
                                id='artist-reply' 
                                name='artist-reply' 
                                placeholder="Type a response..."
                            />
                            <button type="submit" className="post-reply-btn">
                                <i className="bi bi-send-fill"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ReplyForm