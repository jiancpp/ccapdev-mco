import express from 'express';
import Song from '../models/Song.js';

const router = express.Router();

/**
 * Fetch ALL songs or FILTER by album/artist
 * @route   GET /api/songs?album_id=...
 */
router.get('/', async (req, res) => {
    try {
        const { album_id } = req.query; // This is the long ID coming from frontend now
        const { artist_id } = req.query;
        let songs = [];

        if (album_id) {
            // Check your Song model in Atlas—make sure this key matches!
            songs = await Song.find({ albumID: album_id }); 
        } else if (artist_id) {
            songs = await Song.find({ artistID: artist_id }); 
        } else {
            songs = await Song.find();
        }
        res.json(songs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Fetch ONE specific song by ID
 * @route   GET /api/songs/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let song = null;

        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            song = await Song.findById(id);
        }

        if (!song) {
            song = await Song.findOne({ songID: id });
        }

        if (!song) return res.status(404).json({ message: "Song not found" });
        res.json(song);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;