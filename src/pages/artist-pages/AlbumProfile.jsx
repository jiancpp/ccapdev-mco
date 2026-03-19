import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import "./SongProfile.css"; 
import Review from "../../features/review/Review";
import BackButton from "../../components/BackButton"
import { StarRating } from "../../components/StarRating";

import { getArtist, getAlbum, getSongsByAlbum, getReviewsByAlbum } from "../../api/api";

function AlbumProfile() {
    const navigate = useNavigate();
    const { album_id } = useParams();
    const { activeUser, preSelectReviewParams } = useOutletContext();

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

                const albumData = await getAlbum(album_id);
                setAlbum(albumData);

                const [artistData, songsData, reviewsData] = await Promise.all([
                    getArtist(albumData.artistID),
                    getSongsByAlbum(albumData._id),
                    getReviewsByAlbum(albumData._id)
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
            <div className="top-bar">
                <BackButton />
            </div>

            <div className="song-header-card">
                <img 
                    src={album.cover || album?.photo} 
                    alt={album.albumName} 
                    className="main-song-cover"
                />
                
                <div className="song-info-column">
                    <h1 className="main-song-title">{album.albumName}</h1>
                    <div className="main-song-artist">
                        {artist ? artist.name : "Loading Artist..."}
                    </div>
                    <div className="main-song-genre">
                        {album.genre || "Pop"}
                    </div>
                    
                    <div className="main-song-rating" style={{marginBottom: "20px"}}>
                        <span className="rating-number">{album.aveRating || 0}</span>
                        <StarRating rating={Number(album.aveRating || 0)} />
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
                    className={`nav-item ${activeTab === 'tracklist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tracklist')}
                >
                    Tracklist
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
                                            onClick={() => {
                                                    if (!album || !artist) return;
                                                    preSelectReviewParams({
                                                        targetID: album_id,
                                                        targetType: 'Album',
                                                        selectedRating: i + 1,
                                                        title: album.albumName,
                                                        artistID: artist._id, 
                                                        cover: album.cover,
                                                    });
                                                }
                                             }></i>
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

                {activeTab === 'tracklist' && (
                    <div className="album-tracklist">
                        <h3>Tracklist</h3>
                        <div className="songs-list">
                            {songs.map((song, index) => (
                                <div 
                                    className="song-row" 
                                    key={song._id}
                                    onClick={() => navigate(`/songs/${song._id}`)} 
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="song-image-container">
                                        <img 
                                            src={song.cover || album.cover} 
                                            alt={song.songTitle} 
                                            className="song-cover"
                                        />
                                    </div>
                                    <div className="song-info">
                                        <span className="song-title">{index + 1}. {song.songTitle || song.title}</span>
                                    </div>
                                    <div className="song-rating-container">
                                        <StarRating rating={Number(song.aveRating || song.rating || 0)} />
                                    </div>
                                    <div className="song-duration">
                                        {song.duration}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AlbumProfile;