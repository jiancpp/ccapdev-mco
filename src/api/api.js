const BASE_URL = 'http://localhost:5001/api'

/********************* UNIVERSAL APIs **********************/

/**
 * Fetches all data for a specified schema or model
 * @param {String} model identifier for which schema is being fetched (e.g. "reviews" for Review)
 * @returns JSON of model data
 */
export const getAllData = async (model) => {
    const res = await fetch(`${BASE_URL}/${model}`);
    if (!res.ok) 
    { 
        throw new Error(`Failed to fetch ${model}`);
    }

    return await res.json();
}    

/**
 * For error handling 
 * @param {*} res response
 * @param {String} errorMsg error messgae
 * @returns JSON response
 */
const handleResponse = async (res, errorMsg) => {
    if (!res.ok) throw new Error(errorMsg || 'Failed to handle response.');
    return await res.json();
};

/********************* USER APIs **********************/
/**
 * Fetches user based on id
 * @param {String} userId id of user being fetched
 * @returns JSON of User data
 */
export const getUser = async (userId) => {
    const res = await fetch(`${BASE_URL}/users/get/${userId}`);
    return await handleResponse(res, `Failed to fetch user ${userId}`);
}  

/********************* REVIEW APIs **********************/
/**
 * Fetches reviews created by user
 * @param {String} userId id used to filter reviews
 * @returns JSON of reviews data
 */
export const getReviewsByUser = async (userId) => {
    const res = await fetch(`${BASE_URL}/reviews?user=${userId}`);
    return await handleResponse(res, `Failed to fetch reviews by ${userId}`);
}  

/**
 * Fetches reviews liked by user
 * @param {String} userId id used to filter reviews
 * @returns JSON of reviews data
 */
export const getLikedReviewsByUser = async (userId) => {
    // console.log("Fetching liked reviews by user...");
    const res = await fetch(`${BASE_URL}/reviews/liked/${userId}`);
    return await handleResponse(res, `Failed to fetch liked reviews by ${userId}`);
}  

/**
 * Fetches reviews for an artist
 * @param {String} artistId id used to filter reviews
 * @returns JSON of reviews data
 */
export const getReviewsForArtist = async (artistId) => {
    const res = await fetch(`${BASE_URL}/reviews?artist=${artistId}`);
    return await handleResponse(res, `Failed to fetch reviews for artist ${artistId}`);
}  

/**
 * Creates a new review record in MongoDB
 * @param {Object} reviewData formatted according to the MongoDB schema
 * @returns JSON of the saved record
 */
export const createReview = async (reviewData) => {
    const res = await fetch(`${BASE_URL}/reviews/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
    });

    return await handleResponse(res, `Failed to create the review record.`);
}

export const postReaction = async (reviewId, userId, reactType) => {
    const res = await fetch(`${BASE_URL}/reviews/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            reviewId: reviewId,
            userId: userId,
            type: reactType 
        }),
    });
    return await handleResponse(res, `Failed to update review reaction.`);
}

export const getIsReactedByUser = async (reviewId, userId) => {
    const res = await fetch(`${BASE_URL}/reviews/check_react/${reviewId}/${userId}`);
    return await handleResponse(res, `Failed to check if user reacted to review`);
}

export function getTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();

    const secondsDiff = Math.round((now - date) / 1000);
    const minutesDiff = Math.round(secondsDiff/ 60);
    const hoursDiff = Math.round(minutesDiff / 60);
    const daysDiff = Math.round(hoursDiff / 24);

    if (secondsDiff < 60) return "Just now";
    if (minutesDiff < 60) return `${minutesDiff}m ago`;
    if (hoursDiff < 24) return `${hoursDiff}h ago`;
    if (daysDiff < 7) return `${daysDiff}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})
} 

export function isReviewEdited(created, updated) {
    return created === updated;
}

/********************* ARTIST APIs **********************/
/**
 * Fetches artist based on id
 * @param {String} artistId id of artist being fetched
 * @returns JSON of Artist data
 */
export const getArtist = async (artistId) => {
    const res = await fetch(`${BASE_URL}/artists/get/${artistId}`);
    if (!res.ok) 
    { 
        throw new Error(`Failed to fetch artist ${artistId}`); 
    }

    return await res.json();
}  

/********************* ALBUM & SONG APIs **********************/

/**
 * Fetches album based on id
 */
export const getAlbum = async (albumId) => {
    const res = await fetch(`${BASE_URL}/albums/${albumId}`); 
    if (!res.ok) throw new Error(`Failed to fetch album ${albumId}`);
    return await res.json();
}

/**
 * Fetches all songs belonging to a specific album
 */
export const getSongsByAlbum = async (albumId) => {
    // Cleaned up path
    const res = await fetch(`${BASE_URL}/songs?album_id=${albumId}`); 
    if (!res.ok) throw new Error(`Failed to fetch songs for album ${albumId}`);
    return await res.json();
}

export const getSong = async (songId) => {
    const res = await fetch(`${BASE_URL}/songs/${songId}`); 
    if (!res.ok) throw new Error(`Failed to fetch song ${songId}`);
    return await res.json();
};

/**
 * Fetches all reviews for a specific album
 */
export const getReviewsByAlbum = async (albumId) => {
    const res = await fetch(`${BASE_URL}/reviews?targetID=${albumId}`);
    if (!res.ok) throw new Error(`Failed to fetch reviews for ${albumId}`);
    return await res.json();
}

/**
 * Fetches all reviews for a specific song
 */
export const getReviewsBySong = async (songId) => {
    const res = await fetch(`${BASE_URL}/reviews?targetID=${songId}`);
    if (!res.ok) throw new Error(`Failed to fetch reviews for song ${songId}`);
    return await res.json();
}

/**
 * Fetches reviews based on target (can be song or album)
 * This is a 'bonus' helper in case your backend uses a generic targetID query
 */
export const getReviewsByTarget = async (targetId) => {
    const res = await fetch(`${BASE_URL}/reviews?targetID=${targetId}`);
    if (!res.ok) throw new Error(`Failed to fetch reviews for target ${targetId}`);
    return await res.json();
}