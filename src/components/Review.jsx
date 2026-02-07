import './Review.css'

function Review({username, reviewTitle, numStars, reviewContent}) {
    return (
        <div className="post">
            <div className='flex'>
                <div className="profile"></div>
                <div className="review-details">
                    <p><span className="username">{username}</span>  3hrs ago</p>
                    <h1>{reviewTitle}</h1>
                    <p className="description">{reviewContent}</p>
                </div>
            </div>
            <div className="post-actions flex">
                <button className="post-btn like">
                    <i className="bi bi-heart"></i>
                    <span>55</span>
                </button>
            </div>
        </div>
    )
}

export default Review