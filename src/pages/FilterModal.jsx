import { useState } from 'react';
import './FilterModal.css';

export function FilterModal({ isOpen, onClose, onApply, currentFilters }) {
    const [tempFilters, setTempFilters] = useState(currentFilters);

    const genres = ["Pop", "K-Pop", "OPM", "Rock", "R&B"];
    const ratings = [5, 4, 3, 2, 1];

    if (!isOpen) return null;

    const toggleGenre = (genre) => {
        setTempFilters(prev => ({
            ...prev,
            genres: prev.genres.includes(genre)
                ? prev.genres.filter(g => g !== genre)
                : [...prev.genres, genre] 
        }));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content filter-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Filter Artists</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="filter-section">
                    <p className="filter-label">Tags</p>
                    <div className="tag-container">
                        {genres.map(genre => (
                            <button 
                                key={genre}
                                className={`tag-btn ${tempFilters.genres.includes(genre) ? 'active' : ''}`}
                                onClick={() => toggleGenre(genre)}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-section">
                    <p className="filter-label">Rating</p>
                    <div className="rating-options">
                        {ratings.map(star => (
                            <button 
                                key={star}
                                className={`rating-btn ${tempFilters.rating === star ? 'active' : ''}`}
                                onClick={() => setTempFilters({...tempFilters, rating: star})}
                            >
                                <i className="bi-star-fill" style={{color: '#ffc107'}}></i> {star}-Star +
                            </button>
                        ))}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="clear-btn" onClick={() => setTempFilters({ genres: [], rating: 0 })}>Reset</button>
                    <button className="apply-btn" onClick={() => onApply(tempFilters)}>Apply Filters</button>
                </div>
            </div>
        </div>
    );
}