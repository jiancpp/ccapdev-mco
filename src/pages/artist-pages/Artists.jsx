import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';        
import './Artists.css';

import ArtistBlock from '../../features/artist-block/ArtistBlock';
import { ArtistSearchBar } from '../../components/SearchBar';
import { FilterModal } from '../../modals/FilterModal';
import { getAllData } from '../../api/api';

function Artists() {
    const [allArtists, setAllArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({ genres: [], aveRating: 0 });
    const [searchTerm, setSearchTerm] = useState("");

    /**
     * Fetch all artist data from database
     */
    useEffect(() => {
        const getArtists = async () => {
            try {
                setLoading(true);
                const data = await getAllData("artists");   // function in api.js
                setAllArtists(data);
            } catch (err) {
                setError(err.message);
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        }    
        
        getArtists();
    }, []);
    
    /**
     * Handle artist filter features
     */
    const displayedArtists = allArtists.filter(artist => {
        const name = artist.name || "Unknown artist";
        const bio = artist.user?.bio || "No description yet";
        const genre = artist.genre || "No genre specified";

        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              bio.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesGenre = 
            activeFilters.genres.length === 0 || 
            activeFilters.genres.includes(genre);

        const matchesRating = artist.aveRating >= activeFilters.aveRating;

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