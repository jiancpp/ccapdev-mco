const BASE_URL = 'http://localhost:5000/api'

/********************* USER APIs **********************/
export const getAllUsers = async () => {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) 
    { 
        throw new Error('Failed to fetch users'); 
    }

    return await res.json();
}    

export const getUser = async (userId) => {
    const res = await fetch(`${BASE_URL}/users/get/${userId}`);
    if (!res.ok) 
    { 
        throw new Error(`Failed to fetch user ${userId}`); 
    }

    return await res.json();
}  

/********************* ARTIST APIs **********************/
export const getAllArtists = async () => {
    const res = await fetch(`${BASE_URL}/artists`);
    if (!res.ok) 
    { 
        throw new Error('Failed to fetch artists'); 
    }

    return await res.json();
}    

export const getArtist = async (artistId) => {
    const res = await fetch(`${BASE_URL}/users/get/${artistId}`);
    if (!res.ok) 
    { 
        throw new Error(`Failed to fetch artist ${artistId}`); 
    }

    return await res.json();
}  