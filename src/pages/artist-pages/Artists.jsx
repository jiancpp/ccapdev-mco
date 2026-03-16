import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';        
import './Artists.css';

import ArtistBlock from '../../features/artist-block/ArtistBlock';
import { ArtistSearchBar } from '../../components/SearchBar';
import { FilterModal } from '../../modals/FilterModal';
import { dummyArtists } from '../../data/dummyArtists';

function Artists() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({ genres: [], rating: 0 });
    const [searchTerm, setSearchTerm] = useState("");

    const displayedArtists = dummyArtists.filter(artist => {
        const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            artist.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesGenre = activeFilters.genres.length === 0 || 
            activeFilters.genres.some(g => artist.genre.includes(g));

        const matchesRating = artist.rating >= activeFilters.rating;

        return matchesSearch && matchesGenre && matchesRating;
    });

    const handleApplyFilters = (newFilters) => {
        setActiveFilters(newFilters);
        setIsFilterOpen(false);
    };

    return (
        <div id="artists">
            <div className="toolbar flex f-center">
                <ArtistSearchBar onSearchChange={setSearchTerm} />
                <button className="filters" onClick={() => setIsFilterOpen(true)}>
                    <i className="bi bi-sliders"></i> Filters 
                    {activeFilters.genres.length > 0 && ` (${activeFilters.genres.length})`}
                </button>
            </div>

            <FilterModal 
                isOpen={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)}
                onApply={handleApplyFilters}
                currentFilters={activeFilters}
            />

            <div className="blocks">
                {displayedArtists.map(artist => (
                    <ArtistBlock key={artist._id} artist={artist} />
                ))}
            </div>
        </div>
    );
}

export default Artists