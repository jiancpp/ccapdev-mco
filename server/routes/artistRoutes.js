import express from 'express';

// Import MongoDB Models
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Song from '../models/Song.js';

const router = express.Router();

/**
 * Fetch ONE artist by ID (Bulletproof version)
 * @route   GET /api/artists/get/:id
 */
router.get('/get/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let artist = null;

        // Try searching by MongoDB ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            artist = await Artist.findById(id).populate('user');
        }

        // Fallback: Search by your custom artistID field
        if (!artist) {
            artist = await Artist.findOne({ artistID: id }).populate('user');
        }

        if (!artist) return res.status(404).json({ message: "Artist not found" });
        res.json(artist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;