import express from 'express';
import User from '../models/User.js';
// import bcrypt from 'bcrypt';

const router = express.Router();

// POST /api/users/register
router.post('/register', async (req, res) => {

});

// POST /api/users/login
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({ $or: [
                { email: identifier },
                { username: identifier }
            ] }).select('+password');

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const passMatch = password == user.password;
        if (!passMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        req.session.user = {
            id: user._id
        }

        const userObj = user.toObject();

        delete userObj.password;
        delete userObj.__v;

        userObj.id = userObj._id;

        res.status(200).json({
            message: "Login successful!",
            user: userObj
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/check-session', async (req, res) => {
    try {
        const userId = req.session.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const user = await User.findById(userId)
            .populate("followers", "_id username avatar")
            .populate("following", "_id username avatar")
            .select("-password");

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/users/logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Could not log out" });
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: "Logged out successfully" });
    });
});

// router.get('/check-session', (req, res) => {
//     if (req.session.user) {
//         res.status(200).json({ isAuthenticated: true, user: req.session.user });
//     } else {
//         res.status(401).json({ isAuthenticated: false, message: "Not logged in" });
//     }
// });

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
        const user = await User.findById(userId)
            .populate("followers", "_id username avatar")
            .populate("following", "_id username avatar");

        // Handle user not found
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Return user data
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router;