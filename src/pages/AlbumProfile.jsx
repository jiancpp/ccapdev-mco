import { useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import "./SongProfile.css"; 
import Review from "../components/Review";
import { StarRating } from "../components/StarRating";

import { dummyArtists } from "../data/dummyArtists";
import { dummyReviews } from "../data/dummyReviews";
import { dummySongs } from "../data/dummySongs"; 
import { dummyAlbums } from "../data/dummyAlbums";

// FIX 2: Look inside dummyAlbums, not dummySongs
const getAlbumById = (id) => dummyAlbums.find((album) => album._id === id);
const getArtistById = (id) => dummyArtists.find((artist) => artist._id === id);
const getReviewsByAlbum = (album_id) => dummyReviews.filter((review) => review.album_id === album_id);
const getSongsByAlbum = (album_id) => dummySongs.filter((song) => song.album_id === album_id);

function AlbumProfile() {
    const navigate = useNavigate();
    const { album_id } = useParams();
    const { activeUser, openModal } = useOutletContext();

    const [activeTab, setActiveTab] = useState("reviews");

    const album = getAlbumById(album_id);

    // Safety check
    if (!album) return <div className="indent" style={{padding:"20px"}}>Album not found.</div>;

    const artist = getArtistById(album.artist_id);
    const reviews = getReviewsByAlbum(album_id);
    const songs = getSongsByAlbum(album_id);
    return (
        <div className="song-profile">
            {/* TOP BAR */}
            <div className="top-bar">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <i className="bi bi-chevron-left"></i>
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

            {/* MAIN BANNER CARD */}
            <div className="song-header-card">
                <img 
                    src={album.cover || album?.photo} 
                    alt={album.title} 
                    className="main-song-cover"
                />
                
                <div className="song-info-column">
                    {/* FIX 3: Changed 'song.title' to 'album.title' */}
                    <h1 className="main-song-title">{album.title}</h1>
                    <div className="main-song-artist">
                        {artist ? artist.name : "Unknown Artist"}
                    </div>
                    {/* FIX 4: Changed 'song.genre' to 'album.genre' */}
                    <div className="main-song-genre">
                        {album.genre || "Pop"}
                    </div>
                    
                    <div className="main-song-rating" style={{marginBottom: "20px"}}>
                        <span className="rating-number">{album.rating}</span>
                        <StarRating rating={Number(album.rating)} />
                    </div>
                </div>
            </div>

            {/* NAVIGATION TABS */}
            <div className="song-nav">
                <button 
                    className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews
                </button>
                <button
                    className={`nav-item ${activeTab === 'tracklist' ? 'active' : ''}`}
                    // FIX 5: Set state to 'tracklist'
                    onClick={() => setActiveTab('tracklist')}
                >
                    Tracklist
                </button>
            </div>

            {/* TAB CONTENT */}
            <div className="tab-content">
                {activeTab === 'reviews' && (
                    <>
                        <div className="rate-review-section">
                            <div className="user-input-row">
                                {/* TODO: update next time */}
                                <div className="user-avatar-placeholder">
                                    <i className="bi bi-person-fill"></i>
                                </div>
                                <div className="interactive-stars" onClick={ openModal }>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                </div>
                            </div>
                        </div>

                        <div className="reviews-list">
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

                {/* TRACKLIST TAB */}
                {activeTab === 'tracklist' && (
                    <div className="album-tracklist">
                        <h3>Tracklist</h3>
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
                                                src={song.cover || album.cover} 
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
                                <p className="no-data-msg">No songs found for this album.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AlbumProfile;