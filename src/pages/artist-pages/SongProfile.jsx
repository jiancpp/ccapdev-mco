import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import "./SongProfile.css";
import Review from "../../features/review/Review";
import BackButton from "../../components/BackButton"
import { StarRating } from "../../components/StarRating";

// Ensure these match the exact exports in your src/api/api.js
import { getArtist, getSong, getReviewsBySong } from "../../api/api";

function SongProfile() {
    const navigate = useNavigate();
    const { song_id } = useParams();
    const { activeUser, preSelectReviewParams } = useOutletContext();

    const [activeTab, setActiveTab] = useState("reviews");
    
    // Live Database State
    const [song, setSong] = useState(null);
    const [artist, setArtist] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [lyrics, setLyrics] = useState("");
    const [loadingLyrics, setLoadingLyrics] = useState(false);

    // 1. DATA FETCHING
    useEffect(() => {
        const loadSongPageData = async () => {
            try {
                setLoading(true);

                // Fetch song first
                const songData = await getSong(song_id);
                if (!songData) throw new Error("Song data is null");
                setSong(songData);

                // Fetch artist and reviews in parallel
                // Using songData.artistID (capital ID) to match your Atlas schema
                const [artistData, reviewsData] = await Promise.all([
                    getArtist(songData.artistID).catch(() => null), 
                    getReviewsBySong(song_id).catch(() => [])
                ]);

                setArtist(artistData);
                setReviews(reviewsData || []);

            } catch (error) {
                console.error("Error loading song profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (song_id) {
            loadSongPageData();
        }
    }, [song_id]);

    // 2. LYRIC API FETCHING
    useEffect(() => {
        // Safety check to prevent crashing if data hasn't arrived yet
        if (!song || !artist) return;

        if (song.lyrics) {
            setLyrics(song.lyrics);
            return;
        }

        const fetchLyrics = async () => {
            setLoadingLyrics(true);
            try {
                const aName = artist.artistName || artist.name || "Unknown";
                const sTitle = song.songTitle || song.title || "Unknown";

                const response = await fetch(`https://api.lyrics.ovh/v1/${aName}/${sTitle}`);
                const data = await response.json();

                if (data.lyrics) {
                    setLyrics(data.lyrics.replace(/\r/g, "").replace(/\n\n/g, "\n"));
                } else {
                    setLyrics("Lyrics not found for this song.");
                }
            } catch (error) {
                setLyrics("Could not load lyrics at this time.");
            } finally {
                setLoadingLyrics(false);
            }
        };

        fetchLyrics();
    }, [song, artist]);

    if (loading) return <div className="indent" style={{padding:"20px"}}>Loading Song details...</div>;
    
    // Fallback if the fetch returned nothing
    if (!song) return <div className="indent" style={{padding:"20px"}}>Song not found (ID: {song_id}).</div>;

    return (
        <div className="song-profile">
            <div className="top-bar">
                <BackButton />
            </div>

            <div className="song-header-card">
                <img 
                    src={song.cover || artist?.photo} 
                    alt={song.songTitle || "Song Cover"} 
                    className="main-song-cover"
                />
                
                <div className="song-info-column">
                    <h1 className="main-song-title">{song.songTitle || song.title}</h1>
                    <div className="main-song-artist">
                        {artist ? (artist.artistName || artist.name) : "Unknown Artist"}
                    </div>
                    <div className="main-song-genre">
                        {song.genre || "Pop"}
                    </div>
                    
                    <div className="main-song-rating" style={{marginBottom: "20px"}}>
                        <span className="rating-number">{song.aveRating || 0}</span>
                        <StarRating rating={Number(song.aveRating || 0)} />
                    </div>
                </div>
            </div>

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

            <div className="tab-content">
                {activeTab === 'reviews' && (
                    <>
                        <div className="rate-review-section">
                            <div className="user-input-row">
                                <div className="user-avatar-placeholder">
                                    <i className="bi bi-person-fill"></i>
                                </div>
                                <div className="interactive-stars">
                                    {[...Array(5)].map((_, i) => 
                                        <i  key={i} 
                                            className="bi bi-star-fill" 
                                            onClick={() => preSelectReviewParams(
                                                {
                                                    targetID: song_id,
                                                    targetType: 'Song',
                                                    selectedRating: i + 1,
                                                    title: song.songTitle,
                                                    artistID: artist._id, 
                                                    cover: song.cover,
                                                }
                                             )}></i>
                                    )}
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

                {activeTab === 'lyrics' && (
                    <div className="lyrics-section">
                        <h3>{song.songTitle || song.title}</h3>
                        {loadingLyrics ? (
                            <p style={{color: "#888"}}>Fetching lyrics...</p>
                        ) : (
                            <>
                                <p className="lyrics-text" style={{ whiteSpace: "pre-line" }}>
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