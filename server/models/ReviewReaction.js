import mongoose from 'mongoose';

const ReviewReactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    review: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Review', 
        required: true 
    },

    type: { 
        type: String, 
        enum: ['like', 'dislike'], 
        required: true 
    }
}, { timestamps: true })

// user can have one reaction for a review
ReviewReactionSchema.index({user: 1, review: 1}, {unique: true})

// update counters on review
ReviewReactionSchema.statics.updateCounters = async function(reviewId) {
    const targetId = new mongoose.Types.ObjectId(reviewId);

    const stats = await this.aggregate([
        { $match: { review: targetId }},
        { $group: {
            _id: '$type',
            count: { $sum: 1 }
        }}
    ]);

    const update = { likes: 0, dislikes: 0};
    stats.forEach(s => {
        if (s._id === 'like') update.likes = s.count ;
        if (s._id === 'dislike') update.dislikes = s.count;
    })
    const updatedReview = await mongoose
        .model('Review')
        .findByIdAndUpdate(reviewId, update, { returnDocument: 'after' });
        console.log(`   - Update complete for ${reviewId}:`, update);
};

// Update after saving or updating
ReviewReactionSchema.post('save', async function() {
    await this.constructor.updateCounters(this.review);
});

// Update after removing
ReviewReactionSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await doc.constructor.updateCounters(doc.review);
    }
})

export default mongoose.model('ReviewReaction', ReviewReactionSchema);