import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import "./ArtistView.css";
import Review from "../../features/review/Review";
import NothingBlock from "../../components/NothingBlock";
import { StarRating } from "../../components/StarRating";
import { getAllData, getAlbumsByArtist, getSongsByArtist, getReviewsForArtist } from "../../api/api";


function ArtistView() {
    const navigate = useNavigate();
    const { artist_id } = useParams();
    const { activeUser } = useOutletContext();
    
    const [activeTab, setActiveTab] = useState("reviews");

    // Data
    const [artist, setArtist] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const artistData = await getAllData(`artists?user=${artist_id}`);
                const tempArtist = artistData[0]; // stores artist data to access id in current state
                setArtist(tempArtist);

                const [albumsData, songsData, reviewsData] = await Promise.all([
                    getAlbumsByArtist(tempArtist._id),
                    getSongsByArtist(tempArtist._id),
                    getReviewsForArtist(tempArtist._id)
                ]);

                setAlbums(albumsData ?? []);
                setSongs(songsData ?? []);
                setReviews(reviewsData ?? []);
            } catch (error) {
                console.error("Error loading artist profile data:", error);
            }
        }
        fetchData();
    }, [artist_id])

    if (!artist) return( <div style={{ padding: "20px" }}>Artist not found</div> );

    return (
        <div className="artist-view-container">
            <div className="artist-view">

                <div className="header">
                    <div className="banner"></div>
                    <div className="profile-pic">
                        <img src={activeUser.avatar} alt={artist.name} />
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
                        <span className="country">{artist.country || 'Philippines'}</span>
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
                        Songs ({songs.length || 0})
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'albums' ? 'active' : ''}`}
                        onClick={() => setActiveTab('albums')}
                    >
                        Albums ({albums.length || 0})
                    </button>
                    <button 
                        className={`hidden nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        Analytics
                    </button>
                </div>

                {/* REVIEWS TAB */}
                {activeTab === 'reviews' && (
                    <>

                        <div className="artist-reviews indent">
                            {reviews?.length > 0 ? (
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
                        <h3>Song Performance</h3>
                        <div className="songs-list" style={{ paddingBottom: '15px' }}>
                            {songs?.length > 0 ? (
                                songs.map((song, index) => (
                                    <div className="song-row" key={song._id}>
                                        <div className="song-image-container">
                                            <img 
                                                src={song.cover || artist.photo} 
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
                                        <div className="review-count">
                                            {song.reviewCount || 0} review{song?.reviewCount != 1 ? 's' : ''}
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
                        <h3>Albums Performance</h3>
                        <div className="songs-list" style={{ paddingBottom: '15px' }}>
                            {albums?.length > 0 ? (
                                albums.map((album, index) => (
                                    <div className="song-row" key={album._id}>
                                        <div className="song-image-container">
                                            <img 
                                                src={album.cover || artist.photo} 
                                                alt={album.albumTitle} 
                                                className="song-cover" 
                                            />
                                        </div>
                                        <div className="song-info">
                                            <div className="song-title">{index + 1}. {album.albumName}</div>
                                            <div className="album-year">
                                                {album.year} • {album.songCount || 0} Songs
                                            </div>
                                        </div>
                                        <div className="song-rating-container">
                                            <StarRating rating={Number(album.aveRating)} />
                                        </div>
                                        <div className="review-count">
                                            {album.reviewCount || 0} review{album.reviewCount != 1 ? 's' : ''}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <NothingBlock/>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="dashboard">
                {/* Edit Profiles */}
                <div className="dashboard-item">
                    <div className="item-header">
                    <h3>Public Profile</h3>
                    <button className="edit-icon-btn" title="Edit Profile">
                        <i className="bi bi-pencil-fill"></i>
                    </button>
                    </div>                    
                    <dl className="profile-details">
                        <div className="detail-group">
                            <dt>Display Name</dt>
                            <dd>{artist.name}</dd>
                        </div>
                        <div className="detail-group">
                            <dt>Description</dt>
                            <dd>{activeUser.bio || "No bio added yet."}</dd>
                        </div>
                    </dl>
                </div>

                {/* Edit Genre */}
                <div className="dashboard-item">
                    <div className="item-header">
                    <h3>Genre/s</h3>
                    <button className="edit-icon-btn">
                        <i className="bi bi-pencil-fill"></i>
                    </button>
                    </div>                    
                    <div className="tag-container">
                        <span className="genre-tag">Pop</span>
                        <span className="genre-tag">R&B</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArtistView;