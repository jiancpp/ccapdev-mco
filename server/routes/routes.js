import express from 'express';
// Import MongoDB Models
import User from '../models/User.js';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Song from '../models/Song.js';
import Review from '../models/Review.js';
import ReviewReaction from '../models/ReviewReaction.js';
import ReviewReply from '../models/ReviewReply.js';
const router = express.Router();

/**
 * @route   GET /api/artists
 * @desc    Get all artists with their user details
 */
router.get('/artists', async (req, res) => {
    try {    
        const artists = await Artist.find().populate('user');
        res.json(artists);
    } catch (err) {
        console.error("Error fetching artists:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * @route   GET /api/users
 * @desc    Get all users with their user details
 */
router.get('/users', async (req, res) => {
    try {
        const users = await User.find(req.query) //.select("-password"); // hide passwords
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: err.message });
    }
})

export default router;