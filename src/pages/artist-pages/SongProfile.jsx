import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import "./SongProfile.css";
import Review from "../../features/review/Review";
import { StarRating } from "../../components/StarRating";

import { dummyArtists } from "../../data/dummyArtists";
import { dummyReviews } from "../../data/dummyReviews";
import { dummySongs } from "../../data/dummySongs"; 

const getArtistById = (id) => dummyArtists.find((artist) => artist._id === id);
const getSongById = (id) => dummySongs.find((song) => song._id === id);
const getReviewsBySong = (song_id) => dummyReviews.filter((review) => review.song_id === song_id);

function SongProfile() {
    const navigate = useNavigate();
    const { song_id } = useParams();
    const { activeUser, openModal } = useOutletContext();

    const [activeTab, setActiveTab] = useState("reviews");
    
    const [lyrics, setLyrics] = useState("");
    const [loadingLyrics, setLoadingLyrics] = useState(false);

    const song = getSongById(song_id);

    if (!song) return <div className="indent" style={{padding:"20px"}}>Song not found.</div>;

    const artist = getArtistById(song.artist_id);
    const reviews = getReviewsBySong(song_id);

    // LYRIC API FETCHING
    useEffect(() => {
        if (!song || !artist) return;

        if (song.lyrics) {
            setLyrics(song.lyrics);
            return;
        }

        const fetchLyrics = async () => {
            setLoadingLyrics(true);
            try {
                const response = await fetch(`https://api.lyrics.ovh/v1/${artist.name}/${song.title}`);
                const data = await response.json();

                if (data.lyrics) {
                    const cleanLyrics = data.lyrics
                        .replace(/\r/g, "")
                        .replace(/\n\n/g, "\n");

                    setLyrics(cleanLyrics);
                } else {
                    setLyrics("Lyrics not found for this song.");
                }
            } catch (error) {
                console.error("Error fetching lyrics:", error);
                setLyrics("Could not load lyrics at this time.");
            }
            setLoadingLyrics(false);
        };

        fetchLyrics();
    }, [song, artist]);

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
                    src={song.cover || artist?.photo} 
                    alt={song.title} 
                    className="main-song-cover"
                />
                
                <div className="song-info-column">
                    <h1 className="main-song-title">{song.title}</h1>
                    <div className="main-song-artist">
                        {artist ? artist.name : "Unknown Artist"}
                    </div>
                    <div className="main-song-genre">
                        {song.genre || "Pop"}
                    </div>
                    
                    <div className="main-song-rating" style={{marginBottom: "20px"}}>
                        <span className="rating-number">{song.rating}</span>
                        <StarRating rating={Number(song.rating)} />
                    </div>

                    {/* SPOTIFY EMBED */}
                    {song.spotify_id && (
                        <div className="spotify-embed-container">
                            <iframe 
                                style={{borderRadius: "12px"}} 
                                src={`https://open.spotify.com/embed/track/${song.spotify_id}?utm_source=generator&theme=0`} 
                                width="100%" 
                                height="80" 
                                frameBorder="0" 
                                allowFullScreen="" 
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                loading="lazy">
                            </iframe>
                        </div>
                    )}
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
                    className={`nav-item ${activeTab === 'lyrics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lyrics')}
                >
                    Lyrics
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

                {/* UPDATED LYRICS TAB */}
                {activeTab === 'lyrics' && (
                    <div className="lyrics-section">
                        <h3>{song.title}</h3>
                        {loadingLyrics ? (
                            <p style={{color: "#888", fontStyle: "Helvetica"}}>Fetching lyrics...</p>
                        ) : (
                            <>
                                <p className="lyrics-text">
                                    {lyrics}
                                </p>
                                <div className="lyrics-footer">
                                    Lyrics provided by lyrics.ovh
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SongProfile;