import { useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import "./ArtistProfile.css";
import Review from "../components/Review";
import { StarRating } from "../components/StarRating";

import { dummyArtists } from "../data/dummyArtists";
import { dummyReviews } from "../data/dummyReviews";
import { dummySongs } from "../data/dummySongs"; 
import { dummyAlbums } from "../data/dummyAlbums"; 

const getArtistById = (id) => dummyArtists.find((artist) => artist._id === id);
const getReviewsByArtist = (artist_id) => dummyReviews.filter((review) => review.artist_id === artist_id);
const getSongsByArtist = (artist_id) => dummySongs.filter((song) => song.artist_id === artist_id);
const getAlbumsByArtist = (artist_id) => dummyAlbums.filter((album) => album.artist_id === artist_id);

function ArtistProfile() {
    const navigate = useNavigate();
    const { artist_id } = useParams();
    const { activeUser } = useOutletContext();
    
    const [activeTab, setActiveTab] = useState("reviews");

    const artist = getArtistById(artist_id);    
    const reviews = getReviewsByArtist(artist_id);
    const songs = getSongsByArtist(artist_id);
    const albums = getAlbumsByArtist(artist_id);

    if (!artist) return( <div style={{ padding: "20px" }}>Artist not found</div> );

    return (
        <div className="artist-profile">
            <div className="top-bar">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left"></i> Back
                </button>
                
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search songs, artists, and albums" 
                        className="search-input"
                    />
                    <i className="bi bi-search search-icon"></i>
                </div>
            </div>

            <div className="header">
                <div className="banner"></div>
                <div className="profile-pic">
                    <img src={artist.photo} alt={artist.name} />
                </div>
            </div>

            <div className="artist-profile-details indent">
                <div className="artist-name">{artist.name}</div>
                <div className="artist-rating">
                    <span className="stars">
                        <StarRating rating={Number(artist.rating)} />
                    </span> 
                </div>
                <div className="artist-meta">
                    <span className="country">{artist.country}</span>
                </div>
            </div>

            <div className="artist-nav indent">
                <button 
                    className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews
                </button>
                <button 
                    className={`nav-item ${activeTab === 'songs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('songs')}
                >
                    Songs ({songs.length})
                </button>
                <button 
                    className={`nav-item ${activeTab === 'albums' ? 'active' : ''}`}
                    onClick={() => setActiveTab('albums')}
                >
                    Albums ({albums.length})
                </button>
            </div>

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
                <>
                    <div className="rate-review-section indent">
                        <h3>Rate and Review</h3>
                        <div className="user-input-row">
                            <div className="user-avatar-small"></div>
                            <div className="empty-stars">★★★★★</div>
                        </div>
                    </div>

                    <div className="artist-reviews indent">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <Review key={review._id} review={review} activeUser={activeUser} />
                            ))
                        ) : (
                            <p className="no-data-msg">No reviews yet.</p>
                        )}
                    </div>
                </>
            )}

            {/* SONGS TAB */}
            {activeTab === 'songs' && (
                <div className="artist-songs indent">
                    <h3>Top Songs</h3>
                    <div className="songs-list">
                        {songs.length > 0 ? (
                            songs.map((song, index) => (
                                <div 
                                    className="song-row" 
                                    key={song._id}
                                    onClick={() => navigate(`/songs/${song._id}`)} 
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="song-image-container">
                                        <img 
                                            src={song.cover || artist.photo} 
                                            alt={song.title} 
                                            className="song-cover"
                                        />
                                    </div>
                                    <div className="song-info">
                                        <span className="song-title">{index + 1}. {song.title}</span>
                                    </div>
                                    <div className="song-rating-container">
                                        <StarRating rating={Number(song.rating)} />
                                    </div>
                                    <div className="song-duration">
                                        {song.duration}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-data-msg">No songs found for this artist.</p>
                        )}
                    </div>
                </div>
            )}

            {/* --- ALBUMS TAB --- */}
            {activeTab === 'albums' && (
                <div className="artist-albums indent">
                    <h3>Albums</h3>
                    <div className="albums-grid">
                        {albums.length > 0 ? (
                            albums.map((album) => (
                                <div className="album-card" key={album._id}
                                onClick={() => navigate(`/albums/${album._id}`)}>
                                    <img 
                                        src={album.cover || artist.photo} 
                                        alt={album.title} 
                                        className="album-cover" 
                                    />
                                    <div className="album-info">
                                        <div className="album-title">{album.title}</div>
                                        <div className="album-year">
                                            {album.year} • {album.songs} Songs
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-data-msg">No albums found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ArtistProfile;