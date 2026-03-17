import express from 'express';

import Review from '../models/Review.js';
import ReviewReaction from '../models/ReviewReaction.js';
import ReviewReply from '../models/ReviewReply.js';

const router = express.Router();

const reviewPopulate = [
    { path: 'user', select: 'username avatar' },
    { path: 'artist', select: 'name' },
    { 
        path: 'targetID', 
        // select: 'albumName songTitle cover albumID songCount',
        populate: { path: 'albumID', select: 'albumName cover', options: { strictPopulate: false } },
        options: { strictPopulate: false }
    }
];

/**
 * Fetch ALL review data from the database
 * @route   GET /api/reviews
 * @desc    Get all reviews
 */
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find(req.query).populate(reviewPopulate);
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
        const review = await Review.findById(reviewId).populate(reviewPopulate)

        // Handle review not found
        if(!review) {
            return res.status(404).json({ message: 'Review not found'})
        }

        // Return review data
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router;