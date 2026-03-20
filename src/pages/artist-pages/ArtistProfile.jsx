import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import "./ArtistProfile.css";
import Review from "../../features/review/Review";
import { StarRating } from "../../components/StarRating";

import { getArtist, getAlbumsByArtist, getSongsByArtist, getSongsByAlbum, getReviewsForArtist } from '../../api/api';

function ArtistProfile() {
    const navigate = useNavigate();
    const { artist_id } = useParams();
    const { activeUser, openModal } = useOutletContext();
    
    const [activeTab, setActiveTab] = useState("reviews");

    // Live Database State
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [albSongCounts, setAlbSongCounts] = useState([]);
    const [songs, setSongs] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadArtistPageData = async () => {
            try {
                setLoading(true);

                const artistData = await getArtist(artist_id);
                setArtist(artistData);

                const [albumsData, songsData, reviewsData] = await Promise.all([
                    getAlbumsByArtist(artist_id),
                    getSongsByArtist(artist_id),
                    getReviewsForArtist(artist_id)
                ]);

                const albumSongCounts = await Promise.all(
                    albumsData.map(album => getSongsByAlbum(album._id).then(s => s?.length ?? 0))
                );

                setAlbums(albumsData ?? []);
                setAlbSongCounts(albumSongCounts);
                setSongs(songsData ?? []);
                setReviews(reviewsData ?? []);

            } catch (error) {
                console.error("Error loading artist profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (artist_id) {
            loadArtistPageData();
        }
    }, [artist_id]);

    if (!artist) return( <div style={{ padding: "20px" }}>Artist not found</div> );

    return (
        <div className="artist-profile">
            <div className="top-bar">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <i className="bi bi-chevron-left"></i> Back
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

            <div className="header">
                <div className="banner"></div>
                <div className="profile-pic">
                    <img src={artist.user.avatar} alt={artist.name} />
                </div>
            </div>

            <div className="artist-profile-details indent">
                <div className="artist-name">{artist.name}</div>
                <div className="artist-rating">
                    <span className="stars">
                        <StarRating rating={Number(artist.aveRating)} />
                    </span> 
                </div>
                <div className="artist-meta">
                    <span className="country">{artist.country}</span>
                </div>
                <div className="description">
                    <p>{artist.user.bio}</p>
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
                    <div className="rate-review-section indent hidden">
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
                                            src={song.cover || artist.user.avatar} 
                                            alt={song.songTitle} 
                                            className="song-cover"
                                        />
                                    </div>
                                    <div className="song-info">
                                        <span className="song-title">{index + 1}. {song.songTitle}</span>
                                    </div>
                                    <div className="song-rating-container">
                                        <StarRating rating={Number(song.aveRating)} />
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
                            albums.map((album, i) => (
                                <div className="album-card" key={album._id}
                                onClick={() => navigate(`/albums/${album._id}`)}>
                                    <img 
                                        src={album.cover || artist.photo} 
                                        alt={album.albumName} 
                                        className="album-cover" 
                                    />
                                    <div className="album-info">
                                        <div className="album-title">{album.albumName}</div>
                                        <div className="album-year">{album.year} • {albSongCounts[i]} Songs
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