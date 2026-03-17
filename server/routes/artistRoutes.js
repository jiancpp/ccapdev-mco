import express from 'express';

// Import MongoDB Models
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Song from '../models/Song.js';

const router = express.Router();

/**
 * Fetch ALL artist data from the database
 * @route   GET /api/artists
 * @desc    Get all artists with their user details
 */
router.get('/', async (req, res) => {
    try {    
        const artists = await Artist.find().populate('user');
        res.json(artists);
    } catch (err) {
        console.error("Error fetching artists:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

export default router;