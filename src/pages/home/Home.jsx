import { useState, useEffect } from 'react' 
import { useOutletContext } from "react-router-dom";

import './Home.css'

import Review from '../../features/review/Review'
import NothingBlock from '../../components/NothingBlock';
import LoadingBlock from '../../components/LoadingBlock';
import { ReviewSearchBar } from '../../components/SearchBar'
import { dummyUsers } from '../../data/dummyUsers'
import { dummyArtists } from '../../data/dummyArtists'
import { dummySongs } from '../../data/dummySongs'
import { dummyAlbums } from '../../data/dummyAlbums'
import { getAllData } from '../../api/api';

function Home() {
    const { openModal, activeUser } = useOutletContext();
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState("recent")
    const [searchTerm, setSearchTerm] = useState("");

    /**
     * Fetch all reviews data from database
     */
    useEffect(() => {
        const getReviews = async () => {
            try {
                setLoading(true);
                const data = await getAllData("reviews");   // function in api.js
                setReviews(data);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        }

        getReviews();
    }, []);

    // TODO: Work on API to filter recent, popular, and following
    // useEffect(() => {
    //     if (filter==="recent") {
    //         setReviews(dummyReviews);
    //     } else {
    //         setReviews(trendingReviews);
    //     }
    // }, [filter])

    const toggle = (filter) => {
        setFilter((prev) => (prev!==filter ? filter : prev))
    }

    const displayedReviews = reviews;

    // const displayedReviews = reviews.filter(review => {
    //     const user = dummyUsers.find(u => u._id === review.user_id);
    //     const artist = dummyArtists.find(a => a._id === review.artist_id);
    //     const song = dummySongs.find(s => s._id === review.song_id);
    //     const album = dummyAlbums.find(a => a._id === review.album_id);
        
    //     const searchString = [
    //         user?.username,
    //         artist?.name,
    //         song?.title, 
    //         album?.title,
    //         review.review_header,
    //         review.review_content
    //     ]
    //     .filter(Boolean)
    //     .join(" ")
    //     .toLowerCase();

    //     return searchString.includes(searchTerm.toLowerCase());
    // });

    if (loading) return <LoadingBlock />;

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
                        Trending
                    </button>
                    <div className="search-container">
                        <ReviewSearchBar onSearchChange={setSearchTerm} />
                    </div>
                </div>
            </div>
            <div className="review-list-main">
                {displayedReviews.length > 0 ? (
                    displayedReviews.map((review) => (
                        <Review key={review._id} review={review} activeUser={activeUser}/>
                    ))
                ) : (
                    <NothingBlock message={"No reviews found."}/>
                )}
            </div>
        </div>
    )
}

export default Home