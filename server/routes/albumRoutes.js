import express from 'express';
import Album from '../models/Album.js';

const router = express.Router();

/**
 * Fetch ONE album by ID (Supports both MongoDB _id and custom albumID)
 * @route   GET /api/albums/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let album = null;

        // 1. Check if it's a valid 24-character MongoDB ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            album = await Album.findById(id);
        }

        // 2. If not found, search by your custom albumID field (e.g., 'al101')
        if (!album) {
            album = await Album.findOne({ albumID: id });
        }

        if (!album) {
            return res.status(404).json({ message: "Album not found in database" });
        }

        res.json(album);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Fetch ALL albums or FILTER by artist
 * @route   GET /api/albums?album_id=...
 */
router.get('/', async (req, res) => {
    try {
        const { artist_id } = req.query;
        let albums = [];

        if (artist_id) {
            albums = await Album.find({ artistID: artist_id }); 
        } else {
            albums = await Album.find();
        }

        res.json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;