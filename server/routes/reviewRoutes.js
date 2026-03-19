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
        populate: [
            // 1. If it's an Album, get the songCount virtual
            { 
                path: 'songCount', 
                model: 'Album',
                options: { strictPopulate: false } 
            },
            // 2. If it's a Song, populate its albumID field to get the cover/name
            { 
                path: 'albumID', 
                model: 'Album', 
                select: 'albumName cover',
                options: { strictPopulate: false }
            }
        ]
    }
];
/**
 * Find liked reviews based on user id
 * @route   GET /api/reviews/liked/:user_id
 * @desc    Get review based on id
 */
router.get('/liked/:user_id', async (req, res) => {
    try {
        console.log(`Fetching liked reviews...`);
        const userId = req.params.user_id;

        console.log(`Checkpoint A`);
        const reactions = await ReviewReaction.find({ user: userId, type: "like" }).populate("review", "_id")
        console.log(`Checkpoint B`);

        const likedReviewIds = reactions.map(reaction => reaction.review._id);
        for (let id of likedReviewIds) {
            console.log(`  + Liked review id ${id} stored.`);
        }
        const reviews = await Review.find({ _id: { $in: likedReviewIds } }).populate(reviewPopulate);

       // Return review data
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/**
 * Fetch ALL review data from the database
 * @route   GET /api/reviews
 * @desc    Get all reviews
 */
router.get('/', async (req, res) => {
    try {
        console.log(`Fetching all reviews...`);

        // req.query uses query string
        const reviews = await Review.find(req.query).populate(reviewPopulate);
        res.status(200).json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ error: err.message });
    }
})

/**
 * Fetch ALL review data from the database based on optional filter/s
 * @route   GET /api/reviews/filter?user_id&target_id&review_body
 * @desc    Get all reviews
 */
router.get('/filter', async (req, res) => {
    try {
        const filters = [ 'user', 'targetID', 'targetType' ];
        const searchContent = req.query['searchContent']
        let query = {};

        filters.forEach(key => {
            if (req.query[key] && req.query[key] !== "") {
                query[key] = req.query[key];
            }
        })

        if (searchContent) {
            query.$or = [
                { review_header: { $regex: searchContent, $options: 'i' } },
                { review_content: { $regex: searchContent, $options: 'i' } }
            ];
        }

        console.log(`Fetching all reviews based on filters...`);
        const reviews = await Review.find(query).populate(reviewPopulate).setOptions({ strictPopulate: false });;

        reviews.forEach(review => {
            if (review.targetType == 'Album') {
                console.log(` + Check album tracks: ${review.targetID.albumName} - ${review.targetID.songCount}`)
            }
        })
        
        res.status(200).json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ error: err.message });
    }
})

/**
 * Create a new review
 * @route   POST /api/reviews/create
 */
router.post('/create', async (req, res) => {
    try {
        console.log("Incoming review data:", req.body);
        const newReview = new Review(req.body);
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(400).json({ message: error.message });
    }
});

/******************** Reactions **********************/

router.post('/react', async (req, res) => {
    try {
        console.log("Update review reaction:"   );
        const { reviewId, userId, type } = req.body;
        await ReviewReaction.findOneAndDelete({ user: userId, review: reviewId })

        // User unclicked a reaction
        if (!type) return res.status(200).json({ message: "Reaction removed" });;

        const newReaction = new ReviewReaction({
            type: type,
            review: reviewId,
            user: userId
        });

        const savedReaction = await newReaction.save();
        res.status(200).json(savedReaction);

    } catch (error) {
        console.error("Error updating reactions:", error);
        res.status(400).json({ message: error.message });
    }
})


router.get("/check_react/:review_id/:user_id", async (req, res) => {
    try {
        const { review_id, user_id } = req.params;
        const reaction = await ReviewReaction.findOne({ user: user_id, review: review_id });
        res.status(200).json({
            reacted: !!reaction,   // convert to boolean
            type: reaction ? reaction.type : null
        });
    } catch (error) {
        console.error(error.message, error);
        res.status(400).json({ message: error.message });
    }
})


export default router;