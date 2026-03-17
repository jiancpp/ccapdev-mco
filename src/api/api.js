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

/********************* USER APIs **********************/
/**
 * Fetches user based on id
 * @param {String} userId id of user being fetched
 * @returns JSON of User data
 */
export const getUser = async (userId) => {
    const res = await fetch(`${BASE_URL}/users/get/${userId}`);
    if (!res.ok) 
    { 
        throw new Error(`Failed to fetch user ${userId}`); 
    }

    return await res.json();
}  

/********************* REVIEW APIs **********************/
/**
 * Fetches reviews created by user
 * @param {String} userId id used to filter reviews
 * @returns JSON of reviews data
 */
export const getReviewsByUser = async (userId) => {
    const res = await fetch(`${BASE_URL}/reviews/get/${userId}`);
    if (!res.ok) 
    { 
        throw new Error(`Failed to fetch reviews by ${userId}`); 
    }

    return await res.json();
}  

/**
 * Fetches reviews liked by user
 * @param {String} userId id used to filter reviews
 * @returns JSON of reviews data
 */
export const getLikedReviewsByUser = async (userId) => {
    // console.log("Fetching liked reviews by user...");
    const res = await fetch(`${BASE_URL}/reviews/liked/${userId}`);
    if (!res.ok) 
    { 
        throw new Error(`Failed to fetch liked reviews by ${userId}`); 
    }

    return await res.json();
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
    const res = await fetch(`${BASE_URL}/albums/${albumId}`); // Update this path if it's nested under /artists
    if (!res.ok) throw new Error(`Failed to fetch album ${albumId}`);
    return await res.json();
}

/**
 * Fetches all songs belonging to a specific album
 */
export const getSongsByAlbum = async (albumId) => {
    const res = await fetch(`${BASE_URL}/songs?album_id=${albumId}`); 
    if (!res.ok) throw new Error(`Failed to fetch songs for album ${albumId}`);
    return await res.json();
}

/**
 * Fetches all reviews for a specific album
 */
export const getReviewsByAlbum = async (albumId) => {
    const res = await fetch(`${BASE_URL}/reviews?album_id=${albumId}`);
    if (!res.ok) throw new Error(`Failed to fetch reviews for album ${albumId}`);
    return await res.json();
}