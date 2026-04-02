/**
 * Main Server Configuration
 * Stack: Express, MongoDB (Mongoose), Node.js
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import { fileURLToPath } from 'url';

import artistRoutes from './routes/artistRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import albumRoutes from './routes/albumRoutes.js';
import songRoutes from './routes/songRoutes.js';

// Load environment variables
dotenv.config();

mongoose.set('toJSON', { virtuals: true });
mongoose.set('toObject', { virtuals: true });

const PORT = process.env.PORT || 5001;
const MONGOURL = process.env.MONGO_URL;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

// CORS — only needed in development since prod is same-origin
if (!isProduction) {
  app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'very+very+secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGOURL,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    httpOnly: true
  }
}));

// API Routes
app.use('/api/artists', artistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/songs', songRoutes);

app.post('/api/upload-image', async (req, res) => {
  res.json({ success: true });
});

// Serve React frontend (dist folder)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all: send React's index.html for any non-API route
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  }
});

// Connect to MongoDB, then start server
mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));