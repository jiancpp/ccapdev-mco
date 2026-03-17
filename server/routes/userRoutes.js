import express from 'express';
import User from '../models/User.js';

const router = express.Router();

/**
 * Fetch ALL user data from the database
 * @route   GET /api/users
 * @desc    Get all users with their user details
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.find(req.query).select("-password"); // hide passwords
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: err.message });
    }
})

/**
 * Find user based on id
 * @route   GET /api/users/get/:id
 * @desc    Get user based on id
 */
router.get('/get/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        // Handle user not found
        if(!user) {
            return res.status(404).json({ message: 'User not found'})
        }

        // Return user data
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router;