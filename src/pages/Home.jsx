import { useState, useEffect } from 'react' 
import { useOutletContext } from "react-router-dom";

import './Home.css'

import Review from '../components/Review'
import { dummyReviews } from '../data/dummyReviews'
import { trendingReviews } from '../data/trendingReviews'
import { dummyUsers } from '../data/dummyUsers'

function Home() {
    const { openModal } = useOutletContext();

    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState("recent")

    // Simulates API Fetching
    useEffect(() => {
        if (filter==="recent") {
            setReviews(dummyReviews);
        } else {
            setReviews(trendingReviews);
        }
    }, [filter])

    const toggle = (filter) => {
        setFilter((prev) => (prev!==filter ? filter : prev))
    }

    return (
        <div id='home'>
            <div className="buttons flex f-center">
                <div className="filters flex f-center">
                    <button 
                        className={`${filter==="recent" ? "selected" : ""}`}
                        onClick={() => toggle("recent")}>
                        Recent
                    </button>
                    <button 
                        className={`${filter==="trending" ? "selected" : ""}`}
                        onClick={() => toggle("trending")}>
                        Trending</button>
                </div>
                <button className="review-button review-button-fixed" onClick={openModal}>Review +</button>
            </div>
            {reviews.map((review) => (
                <Review key={review._id} review={review} />
            ))}
        </div>
    )
}

export default Home