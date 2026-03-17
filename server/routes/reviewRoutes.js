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
 * Find reviews based on id
 * @route   GET /api/reviews/get/:user_id
 * @desc    Get review based on id
 */
router.get('/get/:user_id', async (req, res) => {
    try {
        const userId = req.params.user_id;
        const reviews = await Review.find({ user: userId }).populate(reviewPopulate)

       // Return review data
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/**
 * Find liked reviews based on user id
 * @route   GET /api/reviews/get/liked/:user_id
 * @desc    Get review based on id
 */
router.get('/get/liked/:user_id', async (req, res) => {
    try {
        const userId = req.params.user_id;
        const reactions = await ReviewReactions.find({ user: userId, type: "like" })
        const likedReviewIds = reactions.map(reaction => reaction.reviewId);
        const reviews = await Review.find({ _id: { $in: likedReviewIds } }).populate(reviewPopulate);

       // Return review data
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router;