import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';        
import './Artists.css';

import ArtistBlock from '../../features/artist-block/ArtistBlock';
import { ArtistSearchBar } from '../../components/SearchBar';
import { FilterModal } from '../../modals/FilterModal';
import { dummyArtists } from '../../data/dummyArtists';

function Artists() {
    const [allArtists, setAllArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({ genres: [], rating: 0 });
    const [searchTerm, setSearchTerm] = useState("");

    /**
     * Fetch all artist data from database
     */
    useEffect(() => {
        const getArtists = async () => {
            try {
                console.log("Checkpoint A");
                const res = await fetch('http://localhost:5000/api/artists');

                if (!res.ok) {
                    throw new Error('Failed to fetch artists');
                }

                console.log("Checkpoint B");
                const data = await res.json();

                setAllArtists(data); // 2. Save fetched data to state
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