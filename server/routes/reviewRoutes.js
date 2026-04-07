import mongoose from 'mongoose';
import express from 'express';

import Review from '../models/Review.js';
import ReviewReaction from '../models/ReviewReaction.js';
import ReviewReply from '../models/ReviewReply.js';
import Notification from '../models/Notification.js';

const router = express.Router();

const reviewPopulate = [
    { path: 'user', select: 'username avatar' },
    {   
        path: 'artist', 
        populate: {
            path: 'user',
            options: { strictPopulate: false } 
        }
    },
    { 
        path: 'targetID',
        populate: [
            // populate album attributes
            { 
                path: 'songCount', 
                model: 'Album',
                options: { strictPopulate: false } 
            },
            // populate song attributes
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
 * Fetch ONE reviews by ID (Bulletproof version)
 * @route   GET /api/reviews/get/:id
 */
router.get('/get/:id', async (req, res) => {
    try {

        const id = req.params.id;
        let review = null;

        // Try searching by MongoDB ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            review = await Review.findById(id).populate(reviewPopulate);
        }

        // Fallback: Search by your custom artistID field
        if (!review) {
            review = await Review.findOne({ artistID: id }).populate(reviewPopulate);
        }

        if (!review) return res.status(404).json({ message: "Review not found" });
        res.json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Find liked reviews based on user id
 * @route   GET /api/reviews/liked/:user_id
 * @desc    Get review based on id
 */
router.get('/liked/:user_id', async (req, res) => {
    try {
        console.log(`Fetching liked reviews...`);
        const userId = req.params.user_id;

        const reactions = await ReviewReaction.find({ user: userId, type: "like" }).populate("review", "_id")

        const likedReviewIds = reactions.map(reaction => reaction.review._id);
        for (let id of likedReviewIds) {
            console.log(`  + Liked review id ${id} stored.`);
        }
        const reviews = await Review.find({ _id: { $in: likedReviewIds } }).populate(reviewPopulate).sort({ createdAt: -1 });

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
        const reviews = await Review.find(req.query)
            .sort({ createdAt: -1 })
            .populate(reviewPopulate);
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
        const { user, targetID, targetType, searchContent, artistName, songTitle, albumTitle } = req.query;
        let query = {};

        const filters = [ 'user', 'targetID', 'targetType' ];
        filters.forEach(key => {
            if (req.query[key] && req.query[key] !== "") {
                query[key] = req.query[key];
            }
        })

        if (searchContent) {
            const [users, artists, songs, albums] = await Promise.all([
                mongoose.model('User').find({ username: { $regex: searchContent, $options: 'i' } }).select('_id'),
                mongoose.model('Artist').find({ name: { $regex: searchContent, $options: 'i' } }).select('_id'),
                mongoose.model('Song').find({ title: { $regex: searchContent, $options: 'i' } }).select('_id'),
                mongoose.model('Album').find({ albumName: { $regex: searchContent, $options: 'i' } }).select('_id')
            ]);

            const userIds = users.map(a => a._id);
            const artistIds = artists.map(a => a._id);
            const targetIds = [...songs.map(s => s._id), ...albums.map(a => a._id)];

            query.$or = [
                { review_header: { $regex: searchContent, $options: 'i' } },
                { review_content: { $regex: searchContent, $options: 'i' } },
                { user: { $in: userIds } },
                { artist: { $in: artistIds } },
                { targetID: { $in: targetIds } }
            ];
        }

        console.log(`Fetching all reviews based on filters...`);
        const reviews = await Review
            .find(query)
            .populate(reviewPopulate)
            .sort({ createdAt: -1 })
            .setOptions({ strictPopulate: false });;        
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
        const { user, artist, _id, targetType, targetID } = savedReview;

        const artistAccount = await mongoose.model('Artist').findOne({_id: artist});
        const targetData = await mongoose.model(targetType).findById(targetID);

        if (!targetData) {
            console.error(`Target ${targetType} with ID ${targetID} not found.`);
            return res.status(201).json(savedReview); // Return success for the review, even if notification fails
        }

        if (targetData) {
            const targetTitle = targetType === 'Album' 
                ? targetData.albumName 
                : targetData.songTitle;

            await Notification.create({ 
                senderId: user, 
                recipientId: artistAccount.user, 
                relatedEntityId: _id,
                type: 'rate',
                content: `posted a review for "${targetTitle}"`,
                createdAt: Date.now() 
            });
        }

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
        const { reviewId, userId, type, postedById } = req.body;
        await ReviewReaction.findOneAndDelete({ user: userId, review: reviewId })

        // User unclicked a reaction
        if (!type) { 
            await Notification.findOneAndDelete({
                senderId: userId,
                recipientId: postedById,
                relatedEntityId: reviewId,
            });
            return res.status(200).json({ message: "Reaction removed" });
        }

        const newReaction = new ReviewReaction({
            type: type,
            review: reviewId,
            user: userId
        });

        const savedReaction = await newReaction.save();

        if (userId !== postedById) {
            await Notification.findOneAndUpdate(
                { 
                    senderId: userId, 
                    recipientId: postedById, 
                    relatedEntityId: reviewId 
                },
                {
                    type: type,
                    createdAt: Date.now() 
                },
                { upsert: true, returnDocument: 'after' }
            );
        }

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

/******************** Replies **********************/

router.get('/reply/get/:review_id/:artist_id', async (req, res) => {
    try {
        const { review_id, artist_id } = req.params.id;
        let reply = null;

        // Try searching by MongoDB ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            reply = await ReviewReply
                .findOne({ artist: artist_id, review: review_id })
                .populate("artist");
        }

        if (!reply) return res.status(404).json({ message: "reply not found" });
        res.json(reply);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/reply', async (req, res) => {
    try {
        console.log("Post artist reply:"   );
        const { reviewId, content } = req.body;
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }        

        if (!review.reply || !review.reply.content) {
            console.log('You should show');
            review.reply = {
                content: content,
                createdAt: Date.now()
            }; 
        }
        else {
            console.log('You should NOT show');

            const newReply = {
                content: content,
                createdAt: review.reply.createdAt,
                updatedAt: Date.now() // replies don't have updatedAt initially
            } 
            review.reply = newReply;
        }
        
        review.markModified('reply');

        await review.save();
        res.status(200).json({ message: 'Successfully posted reply.'});

    } catch (error) {
        console.error("Error adding or updating artist reply:", error);
        res.status(400).json({ message: error.message });
    }
})

/***** Review Actions ******/
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(`  + checking routes ${id}`);
        const review = await Review.findById(id.trim());
        console.log(`  + checking review: ${review}`);
        const artistAccount = await mongoose.model('Artist').findOne({_id: review.artist});
        
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        await Notification.findOneAndDelete({
            senderId: review.user,
            recipientId: artistAccount.user,
            relatedEntityId: id,
        });

        await review.deleteOne();

        res.status(200).json({message: 'Successfully deleted.'})

    } catch (error) {
        console.error("DETAILED BACKEND ERROR:", error);
        res.status(500).json({error: error.message})
    }
})

router.put('/update/:id', async (req, res) => {
    try {
        console.log(`  + checking routes`);
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        review.review_header = req.body.review_header || review.review_header;
        review.review_content = req.body.review_content || review.review_content;
        review.rating = req.body.rating || review.rating;
        review.media = req.body.media || review.media;
        review.isEdited = true;

        console.log(`rating: ${req.body.rating}`);

        await review.save();
        res.status(200).json({message: 'Successfully updated.'})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

export default router;