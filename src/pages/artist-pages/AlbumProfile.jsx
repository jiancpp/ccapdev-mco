import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import "./SongProfile.css"; 
import Review from "../../features/review/Review";
import { StarRating } from "../../components/StarRating";

import { getArtist, getAlbum, getSongsByAlbum, getReviewsByAlbum } from "../../api/api";

function AlbumProfile() {
    const navigate = useNavigate();
    const { album_id } = useParams();
    const { activeUser, openModal } = useOutletContext();

    const [activeTab, setActiveTab] = useState("reviews");

    // Live Database State
    const [album, setAlbum] = useState(null);
    const [artist, setArtist] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAlbumPageData = async () => {
            try {
                setLoading(true);

                // Fetch the album first to get the artist_id
                const albumData = await getAlbum(album_id);
                setAlbum(albumData);

                // Fetch the rest of the data simultaneously
                const [artistData, songsData, reviewsData] = await Promise.all([
                    getArtist(albumData.artist_id),
                    getSongsByAlbum(album_id),
                    getReviewsByAlbum(album_id)
                ]);

                setArtist(artistData);
                setSongs(songsData);
                setReviews(reviewsData);

            } catch (error) {
                console.error("Error loading album profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (album_id) {
            loadAlbumPageData();
        }
    }, [album_id]);

    if (loading) return <div className="indent" style={{padding:"20px"}}>Loading Album details...</div>;
    if (!album) return <div className="indent" style={{padding:"20px"}}>Album not found.</div>;

    return (
        <div className="song-profile">
            {/* TOP BAR */}
            <div className="top-bar">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <i className="bi bi-chevron-left"></i>
                </button>
                
                <div className="search-container hidden">
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
                    <h1 className="main-song-title">{album.title}</h1>
                    <div className="main-song-artist">
                        {artist ? artist.name : "Unknown Artist"}
                    </div>
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