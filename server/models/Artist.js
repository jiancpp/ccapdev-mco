import mongoose from 'mongoose';

const ArtistSchema = new mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})

export default mongoose.model('Artist', ArtistSchema);