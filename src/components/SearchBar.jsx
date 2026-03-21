import { useState } from 'react';
import './SearchBar.css';

export function SearchBar({ songs = [], albums = [], artists = [], onSelect }) {
    const [searchTerm, setSearchTerm] = useState("");

    const getArtistName = (id) => {
        const artist = artists.find(a => a._id === id);
        return artist ? (artist.name) : "Unknown Artist";
    };

    const filteredSongs = songs.filter(song => {
        const title = song.songTitle || ""; 
        const artistName = getArtistName(song.artistID);
        return (
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artistName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const filteredAlbums = albums.filter(album => {
        const title = album.albumName || "";
        const artistName = getArtistName(album.artistID);
        return (
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artistName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleSelect = (item) => {
        if (onSelect) {
            onSelect(item);
        }
        setSearchTerm(""); // Clears the search text
    };

    return (
        <div className="search-parent">
            <div className="search-container">
                <i className="bi bi-search search-icon"></i>
                <input 
                    type="text" 
                    placeholder="Search songs and albums" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {searchTerm && (
                <div className="search-results">
                    {filteredSongs.map(song => (
                        <div key={song._id} className="result-item" onClick={() => handleSelect(song)}>
                            <i className="bi bi-music-note song-icon"></i>
                            <span className='res-title'>{song.songTitle} </span><span className="res-subtitle">{getArtistName(song.artistID)}</span>
                        </div>
                    ))}
                    {filteredAlbums.map(album => (
                        <div key={album._id} className="result-item" onClick={() => handleSelect(album)}>
                            <i className="bi bi-vinyl album-icon"></i>
                            <span className='res-title'>{album.albumName} </span><span className="res-subtitle">{getArtistName(album.artistID)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function ReviewSearchBar({ onSearchChange, placeholder = null }) {
    const [localVal, setLocalVal] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearchChange(localVal);
    }
    return (
        <div className="search-parent">
            <div className="search-container">
                <i className="bi bi-search search-icon"></i>
                <form onSubmit={ handleSubmit }>
                    <span 
                        htmlFor="search" 
                        className={`review-search-clear ${localVal=="" ? "hidden": ""}`}
                        onClick={ () => {
                            setLocalVal("");
                            onSearchChange("");
                        }}>
                        &times;
                    </span>
                    <input 
                        name='search'
                        type="text" 
                        value={localVal}
                        onChange={e => {
                            setLocalVal(e.target.value);
                        }}
                        placeholder={placeholder || "Search reviews"}
                    />
                    <button type="submit" style={{ display: 'none' }} />  
                </form>  
            </div>
        </div>
    );
}

export function ArtistSearchBar({ onSearchChange }) {
    return (
        <div className="search-parent">
            <div className="search-container">
                <i className="bi bi-search search-icon"></i>
                <input 
                    type="text" 
                    placeholder="Search artists" 
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
}

export function AlbumSearchBar({ onSearchChange }) {
    return (
        <div className="search-parent">
            <div className="search-container">
                <i className="bi bi-search search-icon"></i>
                <input 
                    type="text" 
                    placeholder="Search artists" 
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
}

export function SongSearchBar({ onSearchChange }) {
    return (
        <div className="search-parent">
            <div className="search-container">
                <i className="bi bi-search search-icon"></i>
                <input 
                    type="text" 
                    placeholder="Search artists" 
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
}