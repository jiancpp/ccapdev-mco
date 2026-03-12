import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true },
    bio: {
        type: String,
        maxlength: 350
    },

    avatar: String,
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    // liked: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }],

    // Determine user role:
    role: {
        type: String,
        enum: ['user', 'artist'],
        default: 'user'
    },
}, { timestamps: true })

export default mongoose.model('User', UserSchema);