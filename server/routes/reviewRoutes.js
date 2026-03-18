import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

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
        populate: { path: 'albumID', select: '_id albumName cover', options: { strictPopulate: false } },
        options: { strictPopulate: false }
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
 * Find reviews based on id
 * @route   GET /api/reviews/get/:user_id
 * @desc    Get review based on id
 */
router.get('/get/:user_id', async (req, res) => {
    try {
        console.log(`Fetching reviews by user...`);
        const userId = req.params.user_id;
        const reviews = await Review.find({ user: userId }).populate(reviewPopulate)

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
        const { album_id, song_id } = req.query;
        let query = {};

        if (album_id) {
            query = { targetID: album_id, targetType: 'Album' };
        } else if (song_id) {
            query = { targetID: song_id, targetType: 'Song' };
        }

        const reviews = await Review.find(query).populate('user');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

//========= FOR IMAGE UPLOADS =========//

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public/uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/uploadImage', upload.single('UploadFiles'), (req, res) => {
    try {
        const fileUrl = `http://localhost:5001/uploads/${req.file.filename}`;
        
        res.status(200).json({ link: fileUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;