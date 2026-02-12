import { useState, useEffect } from 'react'    
import { useOutletContext } from 'react-router-dom'          
import './Artists.css'

import ArtistBlock from '../components/ArtistBlock'
import { ArtistSearchBar } from '../components/SearchBar'
import { dummyArtists } from '../data/dummyArtists'

function Artists() {
    const { openModal } = useOutletContext()

    const [artists, setArtists] = useState([]);
    const [filter, setFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredArtists = filter === 'All' 
        ? artists 
        : artists.filter(artist => artist.genre.includes(filter));

    useEffect(() => {
        setArtists(dummyArtists)
    }, [])

    const displayedArtists = filteredArtists.filter(artist => {
        return artist.name.toLowerCase().includes(searchTerm.toLowerCase());
    })

    return (
        <div id='artists'>
            <div className="buttons flex f-center">
                <div className="filters flex f-center">
                    <button className={`${filter==="All" ? "selected" : ""}`} onClick={() => setFilter('All')}>All</button>
                    <button className={`${filter==="Pop" ? "selected" : ""}`} onClick={() => setFilter('Pop')}>Pop</button>
                    <button className={`${filter==="K-Pop" ? "selected" : ""}`} onClick={() => setFilter('K-Pop')}>K-Pop</button>
                    <button className={`${filter==="OPM" ? "selected" : ""}`} onClick={() => setFilter('OPM')}>OPM</button>
                    <div className="search-container">
                        <ArtistSearchBar onSearchChange={setSearchTerm} />
                    </div>
                </div>
            </div>
            <div className="blocks">
                {displayedArtists.map((artist) => (
                    <ArtistBlock 
                        key={artist._id} 
                        artist={artist}/>
                ))}
            </div>
        </div>
    )
}

export default Artists