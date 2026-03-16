import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true
    },
    // password: {
    //     type: String,
    //     required: [true, "Please add a password"],
    //     minlength: 8, // Validation: don't allow short passwords
    //     select: false // Hide password from 
    // },
    email: { 
        type: String, 
        required: true, 
        unique: true },
    bio: {
        type: String,
        maxlength: 350
    },

    avatar: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // liked: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }],

    // Determine user role:
    role: {
        type: String,
        enum: ['user', 'artist'],
        default: 'user'
    },
}, { timestamps: true })

export default mongoose.model('User', UserSchema);