import { useState, useEffect } from 'react'              
import './Home.css'

import Review from '../components/Review'
import { dummyReviews } from '../data/dummyreviews'
import { dummyUsers } from '../data/dummyUsers'

function Home() {
    const [reviews, setReviews] = useState([]);

    // Simulates API Fetching
    useEffect(() => {
        setReviews(dummyReviews)
    }, [])

    return (
        <div id='home'>
            <div className="buttons flex f-center">
                <div className="filters flex f-center">
                    <button className='selected'>Recent</button>
                    <button>Trending</button>
                </div>
                <button className="review-button" onClick={() => setActivePage("log-in")}>Review +</button>
            </div>
            {reviews.map((review) => (
                <Review key={review.id} review={review}/>
            ))}
        </div>
    )
}

export default Home