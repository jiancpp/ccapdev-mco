import './Review.css'
import { dummyUsers } from "../data/dummyUsers";

const getUserById = (id) =>
  dummyUsers.find((user) => user._id === id);

function Review({ review }) {
    const user = getUserById(review.user_id);

    return (
        <div className="post">
            <div className='post-content'>
                <div className="profile"></div>
                <div className="review-details">
                    <p><span className="username">{user.username}</span>  3hrs ago</p>
                    <h1>{review.review_header}</h1>
                    <p className="description">{review.review_content}</p>
                </div>
            </div>
            <div className="post-actions flex">
                <button className="post-btn like">
                    <span className='icon'><i className="bi bi-heart"></i></span>
                    <span className="gap"></span>
                    <span>55</span>
                </button>
                <button className="post-btn like">
                    <span className='icon'><i class="bi bi-hand-thumbs-down"></i></span>
                    <span className="gap"></span>
                    <span>55</span>
                </button>
            </div>
        </div>
    )
}

export default Review