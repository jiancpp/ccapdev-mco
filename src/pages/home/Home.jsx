import { useState, useEffect } from 'react' 
import { useOutletContext } from "react-router-dom";

import './Home.css'

import Review from '../../features/review/Review'
import NothingBlock from '../../components/NothingBlock';
import LoadingBlock from '../../components/LoadingBlock';
import AlertBlock from '../../components/AlertBlock';
import { ReviewSearchBar } from '../../components/SearchBar'
import { getAllData } from '../../api/api';

function Home() {
    // TODO: Filter using search terms, using filter button (recent, following, popular)
    const { openModal, activeUser } = useOutletContext();
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState("recent")
    const [searchTerm, setSearchTerm] = useState("");
    const [fetchKey, setFetchKey] = useState("reviews/filter");

    /**
     * Fetch all reviews data from database
     */
    useEffect(() => {
        const getReviews = async () => {
            try {
                setLoading(true);
                const data = await getAllData(fetchKey);   // function in api.js
                setReviews(data);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        }

        getReviews();
    }, [fetchKey]);

    // TODO: Work on API to filter recent, popular, and following
    useEffect(() => {
        const params = new URLSearchParams();

        if (filter === 'albums') {
            params.append('targetType', 'Album');
        }

        if (filter === 'songs') {
            params.append('targetType', 'Song');
        }

        if (searchTerm) {
            params.append('searchContent', searchTerm);
        }

        const queryString = params.toString();
        const newKey = queryString ? `reviews/filter?${queryString}` : "reviews/filter";
        setFetchKey(newKey);
    }, [filter, searchTerm])

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
                        className={`${filter==="albums" ? "selected" : ""}`}
                        onClick={() => toggle("albums")}>
                        Albums
                    </button>
                    <button 
                        className={`${filter==="songs" ? "selected" : ""}`}
                        onClick={() => toggle("songs")}>
                        Songs
                    </button>
                    <div className="search-container">
                        <ReviewSearchBar onSearchChange={setSearchTerm} />
                    </div>
                </div>
            </div>
            { !loading ? (
                    <div className="review-list-main">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <Review key={review._id} review={review} activeUser={activeUser}/>
                            ))
                        ) : (
                            <NothingBlock message={"No reviews found."}/>
                        )}
                    </div>
                ) : (
                    <LoadingBlock />
                )
            }
        </div>
    )
}

export default Home