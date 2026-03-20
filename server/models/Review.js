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
        required: [true, "Please add a content to your review"],
    },

    media: {
        type: [
            {
                url: { type: String, required: true },
                isVideo: { type: Boolean, required: true }
            }
        ],
        default: []
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

ReviewSchema.statics.calculateAverage = async function(idToUpdate, TargetModel, isArtist = false) {
    const matchField = isArtist ? 'artist' : 'targetID';
    
    const stats = await this.aggregate([
        { 
            $match: { [matchField]: new mongoose.Types.ObjectId(idToUpdate) } 
        },
        {
            $group: {
                _id: null, 
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        const finalRating = stats.length > 0 ? Number(stats[0].avgRating.toFixed(1)) : 0;
        
        await TargetModel.findByIdAndUpdate(idToUpdate, {
            aveRating: finalRating
        });
        
        console.log(`Updated ${isArtist ? 'Artist' : 'Target'}: ${idToUpdate} to ${finalRating}`);
    } catch (error) {
        console.error("Aggregation Error:", error);
    }
}

// Update hooks to be 'async' to ensure they complete
ReviewSchema.post('save', async function() {
    const ReviewModel = this.constructor;
    
    // Update Song or Album
    await ReviewModel.calculateAverage(this.targetID, mongoose.model(this.targetType), false);
    
    // Update Artist
    await ReviewModel.calculateAverage(this.artist, mongoose.model('Artist'), true);
});

ReviewSchema.post('deleteOne', async function () {
    if (this.r) {
        const ReviewModel = this.r.constructor;
        await ReviewModel.calculateAverage(this.r.targetID, mongoose.model(this.r.targetType), false);
        await ReviewModel.calculateAverage(this.r.artist, mongoose.model('Artist'), true);
    }
});

export default mongoose.model('Review', ReviewSchema);