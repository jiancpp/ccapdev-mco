import express from 'express';
import Song from '../models/Song.js';

const router = express.Router();

/**
 * Fetch songs (with optional album_id filter)
 * @route   GET /api/songs?album_id=...
 */
router.get('/', async (req, res) => {
    try {
        if (req.query.album_id) {
            const songs = await Song.find({ albumID: req.query.album_id }); 
            return res.json(songs);
        }
        const songs = await Song.find();
        res.json(songs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;