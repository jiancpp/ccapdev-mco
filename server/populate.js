import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Models
import User from './models/User.js';
import Artist from './models/Artist.js';
import Album from './models/Album.js';
import Song from './models/Song.js';
// import Review from './models/Review';
// import ReviewReaction from './models/ReviewReaction';
// import ReviewReply from './models/ReviewReply';

// Data
import { dummyUsers } from './data/dummyUsers.js';
import { dummyArtists } from './data/dummyArtists.js';
import { dummyAlbums } from './data/dummyAlbums.js';
import { dummySongs } from './data/dummySongs.js';
import { dummyReviews } from './data/dummyReviews.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB...");
        // Clear existing data
        await User.deleteMany();
        await Artist.deleteMany();
        await Album.deleteMany();
        await Song.deleteMany();

        const idMap = {};

        // --- SEED USERS --- //
        console.log("Populating users...");
        const createdUsers = await User.insertMany(dummyUsers.map(u => {
            const newID = new mongoose.Types.ObjectId();
            idMap[u._id] = newID;
            return {
                ...u, 
                _id: newID, 
                email: u.email || `${u.username}@gmail.com`,
                followers: [],
                following: []
            }
        }));

        // --- SEED ARTISTS --- //
        console.log("Populating artists...");

        for (const a of dummyArtists) {
            const artistObjectId = new mongoose.Types.ObjectId();
            const userObjectId = new mongoose.Types.ObjectId();

            const artistUser = await User.create({
                _id: userObjectId,
                username: a.name.replace(/\s+/g, '').toLowerCase(), // e.g., "Cup Of Joe" -> "cupofjoe"
                email: `${a.name.replace(/\s+/g, '').toLowerCase()}@unsynth.com`,
                role: 'artist', // Important to distinguish them from regular users
                avatar: a.photo,
                bio: a.description
            });

            await Artist.create({
                ...a,
                _id: artistObjectId,
                user: artistUser._id // Link them here
            });

            idMap[a._id] = artistObjectId;
        }

        // --- SEED ALBUMS --- //
        console.log("Populating albums...");
        const createdAlbums = await Album.insertMany(dummyAlbums.map(al => {
            const newId = new mongoose.Types.ObjectId();
            idMap[al._id] = newId;
            return { 
                ...al, 
                _id: newId, 
                albumName: al.title,
                artistID: idMap[al.artist_id]
            };
        }));

        // --- SEED SONGS --- //
        console.log("Populating songs...");
        await Song.insertMany(dummySongs.map(s => {
            return { 
                ...s, 
                _id: new mongoose.Types.ObjectId(),
                songTitle: s.title,
                artistID: idMap[s.artist_id],
                albumID: s.album_id ? idMap[s.album_id] : null 
            };
        }));

        console.log("Linking social connections...");
        for (let u of dummyUsers) {
            await User.findByIdAndUpdate(idMap[u._id], {
                followers: u.followers.map(oldId => idMap[oldId]),
                following: u.following.map(oldId => idMap[oldId])
            });
        };

        console.log("Database populated with dummy data")
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seedData();