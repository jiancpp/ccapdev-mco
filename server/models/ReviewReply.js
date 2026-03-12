/**
 * Schema for artist replies in posted reviews about their albums or songs
 */

import mongoose from 'mongoose';

const ReviewReplySchema = new mongoose.Schema({
    artist: {
        type: mongoose.Schema.ObjectId,
        ref: 'Artist',
        required: true
    },

    review: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Review', 
        required: true,
    },

    replyContent: String
}, { timestamps: true })

ReviewReplySchema.index({ artist: 1, review: 1}, { unique: true });

export default mongoose.model('ReviewReply', ReviewReplySchema);