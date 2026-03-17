/**
 * Main Server Configuration
 * Stack: Express, MongoDB (Mongoose), Node.js
 */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

mongoose.set('toJSON', { virtuals: true });
mongoose.set('toObject', { virtuals: true });

import artistRoutes from './routes/artistRoutes.js'
import userRoutes from './routes/userRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'

// Load environment variables from .env file
dotenv.config();
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allow your frontend port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());        // allows the server to parse JSON data in request bodies
app.use('/api/artists', artistRoutes);     // allows api to fetch data
app.use('/api/users', userRoutes);     // allows api to fetch data
app.use('/api/reviews', reviewRoutes);     // allows api to fetch data

// <TODO:> add middleware to verify admin status //

// Configuration Constants
const PORT = process.env.PORT || 5001;
const MONGOURL = process.env.MONGO_URL

/**
 * MongoDB Connection Logic
 * Uses mongoose to connect to the URL provided in env variables
 */
mongoose
    .connect(MONGOURL)
    .then(() => console.log("MongoDB Database established successfully"))
    .catch(err => console.log("MongoDB connection error: ", err))

// Test Route to verify server status
app.get('/', (req,res) => { 
    res.send("Server is running");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on: ${PORT}`)
})


/**
 * Fetch Data from MongoDB
 */
// app.get('/api/users', async (req, res) => {
//     try {
//         // mongoose method that fetches all documents
//         const allUsers = await User.find(req.query).select("-password"); // hide passwords
//         res.status(200).json(allUsers);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// })

// /**
//  *  Create new model data in MongoDB
//  */

// app.post('/api/users', async (req, res) => {
//     try {
//         const newUser = new User(req.body);
//         const savedUser = await newUser.save();

//         // New user is an artist
//         if (savedUser.role === 'artist') {
//             await Artist.create({ 
//                 user: savedUser._id,
//             });
//         }

//         res.status(201).json(savedUser);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// })