import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },

    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true,
    },

    // polymorphic targeting to reduce required models
    targetType: {
        type: String,
        enum: ['Album', 'Song'],
        required: true
    },

    targetID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'targetType'
    },

    review_header: {
        type: String,
        required: [true, "Please add a title to your review"],
        maxlength: 100
    },

    review_content: {
        type: String,
        required: [true, "Please add a title to your review"],
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    likes: {
        type: Number, 
        default: 0
    },

    dislikes: {
        type: Number, 
        default: 0
    },

    isEdited: {
        type: Boolean,
        required: true,
        default: false,
    }
}, { timestamps: true })

ReviewSchema.index({ targetID: 1, targetType: 1 });
ReviewSchema.index({ user: 1, targetID: 1 }, { unique: true });  // one review per user

// updates average rating in the target model: albums and songs
ReviewSchema.statics.getAverageRating = async function(targetID, targetModel) {
    const obj = await this.aggregate([
        { $match: { targetID: targetID } },
        { $group: { _id: '$targetID', averageRating: { $avg: '$rating' } } }
    ])

    try {
        await mongoose.model(targetModel).findByIdAndUpdate(targetID, {
            aveRating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0,
        });
    } catch (err) {
        console.error("Error updating average rating", err);
    }
}

ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.targetID, this.targetType);
});

// capture document in pre hook
ReviewSchema.pre('findOneAndDelete', async function (next) {
    // Get reviewId
    this.r = await this.model.findOne(this.getQuery());

    // Cascade deletion
    if (this.r) {
        await mongoose.model('ReviewReaction').deleteMany({ review: this.r._id });
        await mongoose.model('ReviewReply').deleteMany({ review: this.r._id });
    }

    next();
});

ReviewSchema.post('findOneAndDelete', async function () {
    if (this.r) {
        await this.r.constructor.getAverageRating(this.r.targetID, this.r.targetType);
    }
});

export default mongoose.model('Review', ReviewSchema);