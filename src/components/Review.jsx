import './Review.css'

function Review({username, reviewTitle, numStars, reviewContent}) {
    return (
        <div className="post flex">
            <div>
                <p><span className="username">{username}</span>  3hrs ago</p>
                <h1>{reviewTitle}</h1>
                <p className="description">{reviewContent}</p>
            </div>
            <div className="flex"></div>
        </div>
    )
}

export default Review