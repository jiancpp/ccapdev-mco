import express from 'express';

import Review from '../models/Review.js';
import ReviewReaction from '../models/ReviewReaction.js';
import ReviewReply from '../models/ReviewReply.js';

const router = express.Router();

/**
 * Fetch ALL review data from the database
 * @route   GET /api/reviews
 * @desc    Get all reviews
 */
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find(req.query)
            .populate('user', 'username avatar')
            .populate('artist', 'name')
            .populate({
                path: 'targetID',
                select: 'albumName songTitle cover album songCount',
                populate: { 
                    path: 'album',
                    select: 'albumName cover'
                }
            })
        console.log("Fetching review data")
        res.status(200).json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ error: err.message });
    }
})

/**
 * Find review based on id
 * @route   GET /api/reviews/get/:id
 * @desc    Get review based on id
 */
router.get('/get/:id', async (req, res) => {
    try {
        const reviewId = req.params.id;
        const review = await Review.findById(reviewId);

        // Handle review not found
        if(!review) {
            return res.status(404).json({ message: 'Review not found'})
        }

        // Return review data
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router;