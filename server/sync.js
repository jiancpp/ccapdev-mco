import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from './models/Song.js';
import Album from './models/Album.js';
import Artist from './models/Artist.js';
import Review from './models/Review.js';

dotenv.config();

// RUN AFTER ADDING NEW SONGS AND ALBUMS
const syncAllRatings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        // Sync Songs (Target ID is Song ID, Model is Song, isArtist is false)
        const songs = await Song.find({});
        for (const song of songs) {
            await Review.calculateAverage(song._id, Song, false);
        }
        console.log("Synced Songs");

        // Sync Albums (Target ID is Album ID, Model is Album, isArtist is false)
        const albums = await Album.find({});
        for (const album of albums) {
            await Review.calculateAverage(album._id, Album, false);
        }
        console.log("Synced Albums");

        // Sync Artists (Target ID is Artist ID, Model is Artist, isArtist is true)
        const artists = await Artist.find({});
        for (const artist of artists) {
            await Review.calculateAverage(artist._id, Artist, true);
        }
        console.log("Synced Artists");
        process.exit(0); // Close the script
    } catch (err) {
        console.error("❌ Sync failed:", err);
        process.exit(1);
    }
};

syncAllRatings();