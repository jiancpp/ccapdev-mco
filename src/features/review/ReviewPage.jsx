import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReview } from "../../api/api"; 

import './Review.css'
import Review from "./Review";
import BackButton from "../../components/BackButton"
import LoadingBlock from "../../components/LoadingBlock";
import NothingBlock from "../../components/NothingBlock";


function ReviewPage({ activeUser }) {
    const { id } = useParams();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const data = await getReview(id);
                setReview(data);
            } catch (err) {
                console.error("Failed to fetch review", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [id]);

    if (loading) return <LoadingBlock />;
    
    return (
        <div className="review-page">
            <BackButton />
            {!review ? 
                <NothingBlock message={'Link to Review is broken'}/> : 
                <Review review={review} activeUser={activeUser} />}
        </div>
    );
}

export default ReviewPage;