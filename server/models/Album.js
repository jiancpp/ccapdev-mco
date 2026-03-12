const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
    albumName: {
        type: String,
        required: true
    },

    artistID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Artist',
        required: true
    },

    aveRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },

    description: {
        type: String,
        required: true
    },

    releaseDate: {
        type: Date,
        required: true
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// reference reviews
AlbumSchema.virtual('reviews', {
    ref: 'Review',
    localField: "_id",
    foreignField: "targetID",
    justOne: false
})

// For fast lookups
AlbumSchema.index({ artistID: 1 });

module.exports = mongoose.model('Album', AlbumSchema);