import mongoose from 'mongoose';

const AlbumSchema = new mongoose.Schema({
    albumName: {
        type: String,
        required: true
    },

    artistID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },

    aveRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },

    description: { type: String },
    year: { type: Number, required: true },
    cover: { type: String, required: true },

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// count songs in album
AlbumSchema.virtual('songCount', {
    ref: 'Song',
    localField: '_id',
    foreignField: 'albumID',
    count: true // returns the number
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

export default mongoose.model('Album', AlbumSchema);