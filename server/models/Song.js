import mongoose from 'mongoose';

const SongSchema = new mongoose.Schema({
    songTitle: {
        type: String,
        required: true
    },

    artistID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Artist',
        required: true
    },

    albumID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Album'
    },

    // Aggregate
    aveRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },

    description: { type: String },
    duration: { type: String, required: true },
    cover: { type: String, required: true },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// reference reviews
SongSchema.virtual('reviews', {
    ref: 'Review',
    localField: "_id",
    foreignField: "targetID",
    justOne: false
})

SongSchema.index({ artistID: 1 });
SongSchema.index({ albumID: 1 });

export default mongoose.model('Song', SongSchema);