import { useState } from "react";
import { postArtistReply } from "../api/api";

function ReplyForm({ review, activeUser }) {
    const [content, setContent] = useState('');
    const handleReply = async (e) => {
        try {
            e.preventDefault(); 
            if (!content.trim()) return; // empty replies are not accepted
            setContent('');

            await postArtistReply(review._id, content);
            window.location.reload();
        } catch (error) {
            alert("Error saving review: " + error.message);
        }
    }

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
                    <form className="reply-form-element" onSubmit={handleReply}>
                        <div className="reply-input-container">
                            <textarea 
                                id='artist-reply' 
                                name='artist-reply' 
                                placeholder="Type a response..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
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