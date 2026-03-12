const mongoose = require('mongoose');

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
        maxlength: 160
    },
    followers: { 
        type: Number, 
        default: 0
    },

    // Determine user role:
    role: {
        type: String,
        enum: ['user', 'artist'],
        default: 'user'
    },
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema);