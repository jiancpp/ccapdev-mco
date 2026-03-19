import { useState } from 'react';

export function StarRating({ rating = 0 }) {
    const totalStars = 5;

    return (
        <div className="star-row" style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {[...Array(totalStars)].map((_, index) => {
                const starValue = index + 1;
                
                let iconClass = "bi-star"; 
                if (rating >= starValue) {
                    iconClass = "bi-star-fill"; 
                } else if (rating > index && rating < starValue) {
                    iconClass = "bi-star-half"; 
                }

                return (
                    <i
                        key={index}
                        className={`bi ${iconClass}`}
                        style={{ color: '#ffc107' }}
                    ></i>
                );
            })}
            <span style={{ fontSize: '0.8rem', marginLeft: '5px', color: '#000000' }}>
                ({rating})
            </span>
        </div>
    );
}

export function InteractiveStarRating({ totalStars = 5, onRate, currentRating = 0}) { 
    const [rating, setRating] = useState(currentRating);
    const [hover, setHover] = useState(0);

    const handleRating = (starValue) => {
        setRating(starValue);
        if (onRate) {
            onRate(starValue);
        }
    };

    return (
        <div className="star-rating">
            {[...Array(totalStars)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <i
                        key={starValue}
                        className={`bi ${starValue <= (hover || rating) ? 'bi-star-fill' : 'bi-star'}`}
                        style={{ 
                            cursor: 'pointer', 
                            color: starValue <= (hover || rating) ? '#ffc107' : '#e4e5e9',
                            fontSize: '24px',
                            marginRight: '5px'
                        }}
                        onClick={() => handleRating(starValue)} 
                        onMouseEnter={() => setHover(starValue)}
                        onMouseLeave={() => setHover(0)}
                    ></i>
                );
            })}
            <span style={{ marginLeft: '10px', color: 'black' }}>({rating}/{totalStars})</span>
        </div>
    );
}