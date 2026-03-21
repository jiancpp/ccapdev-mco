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
import albumRoutes from './routes/albumRoutes.js';
import songRoutes from './routes/songRoutes.js';
import session from 'express-session';
import { MongoStore } from 'connect-mongo';

// Load environment variables from .env file
dotenv.config();
const PORT = process.env.PORT || 5001;
const MONGOURL = process.env.MONGO_URL
const app = express();

// <TODO:> add middleware to verify admin status //

app.use(cors({
    origin: 'http://localhost:5173', // Allow your frontend port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware

app.use(express.json());        // allows the server to parse JSON data in request bodies
app.use(express.urlencoded({ extended: true }));

// TODO: Login 
app.use(session({
    secret: 'very+very+secret',
    resave: false,   // see what this does later
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGOURL,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
        httpOnly: true
    }
}));

app.use('/api/artists', artistRoutes);     // allows api to fetch data
app.use('/api/users', userRoutes);     // allows api to fetch data
app.use('/api/reviews', reviewRoutes);     // allows api to fetch data
app.use('/api/albums', albumRoutes);
app.use('/api/songs', songRoutes);

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

app.post('/api/upload-image', async (req, res) => {
    res.json({ success: true });
});